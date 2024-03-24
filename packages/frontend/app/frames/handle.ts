import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { ResultAsync, errAsync } from "neverthrow";
import { AddressLike, BigNumberish, BytesLike, ethers } from "ethers";

export interface FrameSignaturePacket {
  trustedData?: {
    messageBytes: string;
  };
}
export interface ValidatedFrameAction {
  message: Message;
}
export interface MissingInfoFrameValidationError {
  kind: "missing";
  message: string;
  error?: any;
}
export interface HubFrameValidationError {
  kind: "hub";
  message: string;
  error?: any;
}
export type FrameValidationError =
  | MissingInfoFrameValidationError
  | HubFrameValidationError;

export function intoMissingInfoFrameValidationError(
  message: string,
  error?: any
): MissingInfoFrameValidationError {
  return {
    kind: "missing",
    message,
    error,
  };
}

export function intoHubFrameValidationError(
  message: string,
  error?: any
): HubFrameValidationError {
  return {
    kind: "hub",
    message,
    error,
  };
}

export function validateFrameAction(
  req: Request
): ResultAsync<ValidatedFrameAction, FrameValidationError> {
  const client = getSSLHubRpcClient("https://hub-api.neynar.com/v1/info");
  const parsedBody: ResultAsync<
    FrameSignaturePacket,
    MissingInfoFrameValidationError
  > = ResultAsync.fromPromise(req.json(), (err) =>
    intoMissingInfoFrameValidationError(
      "Failed to process the request body as JSON",
      err
    )
  );

  return parsedBody
    .andThen((packet) => {
      if (!packet?.trustedData?.messageBytes) {
        return errAsync(
          intoMissingInfoFrameValidationError(
            "Frame Signature Packet is missing or has no trustedData"
          )
        );
      }
      console.log("packet", packet);
      const frameMessageBytes = packet.trustedData.messageBytes;
      const frameMessage = Message.decode(
        Uint8Array.from(Buffer.from(frameMessageBytes, "hex"))
      );
      return ResultAsync.fromPromise(
        client.validateMessage(frameMessage),
        (err) =>
          intoHubFrameValidationError("Couldn't validate message with hub", err)
      );
    })
    .andThen((response) => {
      if (!response.isOk()) {
        return errAsync(
          intoHubFrameValidationError(
            `HubError: ${response.error.message}`,
            response.error
          )
        );
      }

      const validationMessage = response.value?.message;
      if (!response.value.valid || !validationMessage?.data) {
        return errAsync(
          intoHubFrameValidationError("Frame message was invalid")
        );
      }

      // Create a ValidatedFrameAction object
      const validatedFrameAction: ValidatedFrameAction = {
        message: validationMessage,
      };

      // Return the ValidatedFrameAction object wrapped in a ResultAsync
      return ResultAsync.fromPromise(
        Promise.resolve(validatedFrameAction),
        () => intoHubFrameValidationError("Unexpected error")
      );
    });
}
