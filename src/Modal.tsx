import { ReactNode } from "react";
import "./Modal.css";

type ModalProps = {
  children: ReactNode;
};

export default function Modal({ children }: ModalProps) {
  return (
    <div className="modal-backdrop" >
      <div
        className="modal-content"
      >
        {children}
      </div>
    </div>
  );
}
