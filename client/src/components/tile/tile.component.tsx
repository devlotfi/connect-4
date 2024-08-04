import RedDisc from '../../assets/red-disc.svg';
import YellowDisc from '../../assets/yellow-disc.svg';
import { Colors } from '../../common/types/colors.type';
import './tile.css';

interface Props {
  content: Colors | null;
}

export default function Tile({ content }: Props) {
  return (
    <div className="flex h-[1.7rem] w-[1.7rem] sm:h-[3rem] sm:w-[3rem] lg:h-[5rem] lg:w-[5rem]">
      <div
        style={{
          background: 'var(--game-grid-gradient)',
        }}
        className="flex flex-1 rounded-full p-[0.1rem] md:p-[0.3rem] justify-center items-center"
      >
        <div className="flex flex-1 h-full w-full bg-base-100 rounded-full">
          {content ? (
            content === Colors.RED ? (
              <img
                className="animate-[tile_0.5s_ease]"
                src={RedDisc}
                alt="red-disc"
              />
            ) : (
              <img
                className="animate-[tile_0.5s_ease]"
                src={YellowDisc}
                alt="yellow-disc"
              />
            )
          ) : (
            <div className="flex flex-1 h-full w-full bg-base-100 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  );
}
