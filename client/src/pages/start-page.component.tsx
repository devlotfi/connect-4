import { faComputer, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="flex flex-col w-full max-w-[20rem] space-y-5 px-[1rem]">
        <button
          onClick={() => navigate('/online')}
          className=" bg-red-200 rounded-md"
        >
          <div className="flex space-x-2 justify-center items-center text-color-content min-h-[3rem] px-[1rem] rounded-md bg-red-100 duration-300 translate-y-[-0.3rem] hover:translate-y-0">
            <div className="flex">Play Online</div>
            <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>
          </div>
        </button>
        <button
          onClick={() => navigate('/local')}
          className=" bg-yellow-200 rounded-md"
        >
          <div className="flex space-x-2 justify-center items-center text-color-content min-h-[3rem] px-[1rem] rounded-md bg-yellow-100 duration-300 translate-y-[-0.3rem] hover:translate-y-0">
            <div className="flex">Play Locally</div>
            <FontAwesomeIcon icon={faComputer}></FontAwesomeIcon>
          </div>
        </button>
      </div>
    </div>
  );
}
