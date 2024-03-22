import { createFrames, Button } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
  initialState: { pageIndex: 1 },
});
const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <span>
        {ctx.pressedButton?.index === 1
          ? `I clicked ${ctx.searchParams.value}`
          : `Click some button`}
      </span>
    ),
    buttons: [
      <Button key="yes" action="post" target={{ query: { value: "Yes" } }}>
        Say Yes
      </Button>,
      <Button key="no" action="post" target={{ query: { value: "No" } }}>
        Say No
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
