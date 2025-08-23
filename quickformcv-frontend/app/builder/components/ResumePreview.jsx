"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const ResumePreview = ({ children }) => {
  return (
    <div className="relative size-full flex items-center justify-center">
      <TransformWrapper
        initialScale={0.7}
        minScale={0.3}
        maxScale={2}
        wheel={{ wheelEnabled: true }}
        pinch={{ pinchEnabled: true }}
        doubleClick={{ doubleClick: { mode: "reset" } }}
        limitToBounds={false}
        centerOnInit={true}
        alignmentAnimation={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        initialPositionX={0}
        initialPositionY={0}
      >
        {(utils) => (
          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-full !h-full flex items-center justify-center"
          >
            {children}
          </TransformComponent>
        )}
      </TransformWrapper>
    </div>
  );
};
