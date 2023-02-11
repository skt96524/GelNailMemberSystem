import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import { useState } from "react";

export default function useSegments(segments: string[]) {
  const [segment, setSegment] = useState(segments[0]);
  const render = () => (
    <IonSegment
      value={segment}
      onIonChange={(e) => setSegment(e.detail.value || segment)}
    >
      {segments.map((segment) => (
        <IonSegmentButton key={segment} value={segment}>
          <IonLabel>{segment}</IonLabel>
        </IonSegmentButton>
      ))}
    </IonSegment>
  );
  return { segment, setSegment, render };
}
