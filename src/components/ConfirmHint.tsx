import s from "../styles";

interface ConfirmHintProps {
  visible: boolean;
  message: string;
}

export function ConfirmHint({ visible, message }: ConfirmHintProps) {
  return (
    <div
      role="status"
      aria-live="assertive"
      style={{
        ...s.confirmHint,
        ...(visible ? undefined : s.confirmHintHidden),
      }}
    >
      {message}
    </div>
  );
}
