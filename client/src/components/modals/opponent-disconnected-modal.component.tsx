import { faHome, faPlugCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

interface Props {
  modalRef: React.RefObject<HTMLDialogElement>;
}

export default function OpponentDisconnectedModal({ modalRef }: Props) {
  const navigate = useNavigate();

  return (
    <dialog className="outline-none bg-transparent rounded-lg" ref={modalRef}>
      <div className="flex w-full rounded-lg bg-base-200">
        <div className="flex flex-col space-y-5 items-center justify-center bg-base-100 rounded-lg translate-y-[-0.3rem] p-[2rem] w-screen max-w-[40rem]">
          <FontAwesomeIcon
            className="text-[55pt] text-red-100"
            icon={faPlugCircleXmark}
          ></FontAwesomeIcon>
          <div className="flex text-center text-[20pt] text-base-content">
            Opponent disconnected
          </div>
          <button
            onClick={() => navigate('/')}
            className=" bg-red-200 rounded-md"
          >
            <div className="flex space-x-2 justify-center items-center text-color-content min-h-[3rem] px-[1rem] rounded-md bg-red-100 duration-300 translate-y-[-0.3rem] hover:translate-y-0">
              <div className="flex">Back to menu</div>
              <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
            </div>
          </button>
        </div>
      </div>
    </dialog>
  );
}
