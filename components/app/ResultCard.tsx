import { Images, Location } from "../../utils/types";
import Image from "next/future/image";
import { useEffect, useState } from "react";
import { BsFillStarFill } from "react-icons/bs";
import hexDataURL from "../../utils/rgbDataURL";
import { toBase64, shimmer } from "../../utils/shimmer";
import { useTheme } from "next-themes";
import { FiLink } from "react-icons/fi";
import { BiWorld } from "react-icons/bi";
import { TbError404 } from "react-icons/tb";
import Link from "next/link";

export default function ResultCard({ location }: { location: Location }) {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | undefined>();
  const [url, setUrl] = useState<string>();
  const [website, setWebsite] = useState<string>();

  useEffect(() => {
    if (location.photos && location.photos.length > 0) {
      fetch(
        `/api/details?ref=${location.photos[0].photo_reference}&maxwidth=${location.photos[0].width}&place_id=${location.place_id}`
      )
        .then((res) => res.json())
        .then((res) => {
          setImage(res.image);
          setUrl(res.url);
          setWebsite(res.website);
        })
        .catch(() => {
          setImage(undefined);
        });
    } else {
      setImage(undefined);
    }
  }, [location]);

  return (
    <div
      className="flex flex-row max-h-44 lg:max-h-max lg:flex-col min-w-full lg:min-w-fit w-full snap-center gap-2 bg-white dark:bg-zinc-800 rounded-lg p-2 transition-colors duration-300"
      id={location.place_id}
    >
      <Link href={url || website || "/"} passHref>
        {image ? (
          <Image
            src={image}
            alt={location.name}
            width={location.photos ? location.photos[0].width : "800"}
            height={location.photos ? location.photos[0].height : "400"}
            className="object-cover lg:max-h-48 max-w-[50%] lg:max-w-full rounded-md"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(
                location.photos ? location.photos[0].width : "800",
                location.photos ? location.photos[0].height : "400",
                theme == "dark"
              )
            )}`}
          />
        ) : (
          <div className="flex items-center justify-center w-2/3 lg:w-full h-48 rounded-md bg-slate-100 dark:bg-zinc-700">
            <TbError404 className="text-4xl text-gray-400" />
          </div>
        )}
      </Link>
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex flex-col gap-1">
          <div>
            {location.opening_hours && (
              <span
                className={`font-semibold text-sm ${
                  location.opening_hours.open_now
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {location.opening_hours.open_now ? "Open Now" : "Closed"}
              </span>
            )}
            <div className="text-lg font-semibold max-w-[11rem] md:max-w-sm truncate break-all">
              {location.name}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {location.vicinity}
          </div>
          <div className="flex flex-row gap-2 lg:items-center">
            {location.price_level && (
              <>
                <div className="flex flex-row gap-0">
                  {[...Array(location.price_level)].map((_, i) => {
                    return (
                      <span className="text-emerald-600" key={i}>
                        {"$"}
                      </span>
                    );
                  })}
                  {[...Array(5 - location.price_level)].map((_, i) => {
                    return (
                      <span
                        className="text-gray-400 dark:text-gray-600"
                        key={i}
                      >
                        {"$"}
                      </span>
                    );
                  })}
                </div>
                •
              </>
            )}
            <span className="flex flex-row gap-1 items-center">
              {location.rating} <BsFillStarFill className="text-amber-500" />
            </span>
            <span className="hidden lg:block">•</span>
            <span className="text-gray-500 dark:text-gray-400 hidden lg:block">
              {location.user_ratings_total} reviews
            </span>
          </div>
        </div>
        <div className="lg:flex flex-row lg:flex-col justify-start items-center gap-2 mr-2 my-2 hidden">
          {website && (
            <a href={website}>
              <button className="text-gray-600 dark:text-gray-300 transition-colors duration-150 hover:text-secondary-600 hover:dark:text-secondary-400 rounded-md">
                <BiWorld className="w-6 h-6" />
              </button>
            </a>
          )}
          {url && (
            <a href={url}>
              <button className="text-gray-600 dark:text-gray-300 transition-colors duration-150 hover:text-secondary-600 hover:dark:text-secondary-400 rounded-md">
                <FiLink className="w-6 h-6" />
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
