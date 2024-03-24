import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { ok, ResultAsync, errAsync } from "neverthrow";

export interface FrameSignaturePacket {
  trustedData?: {
    messageBytes: string;
  };
  untrustedData?: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    castId: {
      fid: number;
      hash: string;
    };
  };
}

export interface ValidatedFrameAction {
  message: Message;
  untrustedData: {
    fid: number;
  };
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

export function returnFrameAction(
  req: Request
): ResultAsync<ValidatedFrameAction, FrameValidationError> {
  const client = {
    validateMessage: (message: Message) =>
      Promise.resolve({ isOk: () => true, value: { message, valid: true } }),
  };

  const parsedBody: ResultAsync<
    FrameSignaturePacket,
    MissingInfoFrameValidationError
  > = ResultAsync.fromPromise(req.json(), (err) =>
    intoMissingInfoFrameValidationError(
      "Failed to process the request body as JSON",
      err
    )
  );

  return parsedBody.andThen((packet) => {
    if (!packet?.trustedData?.messageBytes || !packet.untrustedData) {
      return errAsync(
        intoMissingInfoFrameValidationError(
          "Frame Signature Packet is missing or has no trustedData/untrustedData"
        )
      );
    }

    console.log("Packet: ", packet);
    const frameMessageBytes = packet.trustedData.messageBytes;
    const frameMessageByteArray = Uint8Array.from(
      Buffer.from(frameMessageBytes, "hex")
    );
    const frameMessage = Message.decode(frameMessageByteArray);

    const validatedFrameAction: ValidatedFrameAction = {
      message: frameMessage,
      untrustedData: {
        fid: packet.untrustedData.fid,
      },
    };

    return ok<ValidatedFrameAction, FrameValidationError>(validatedFrameAction);
  });
}
