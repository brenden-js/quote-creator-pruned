import Nav from "../../components/nav";
import { prisma } from "~/server/db";
import dayjs from "dayjs";
import type { House } from "@prisma/client";
import dynamicQuoteGenerator, {
  allCachedRegionData,
  type RegionData,
} from "~/utils/quote-gen";

const HouseIndex = ({ house }: { house: House }) => {
  console.log("House", house);
  return (
    <main className="grow min-h-screen flex flex-col items-center">
      <Nav />
      {house === null ? (
        <div>We could not find the house you requested</div>
      ) : (
        <div className="flex max-w-screen-2xl flex-col items-center justify-center py-32 p-16">
          <div className="my-8">
            <div className="flex grow items-center justify-between">
              <div>
                <h1 className="text-4xl text-center font-bold">{house.stAddress}</h1>
                <p className="text-center text-2xl">{`${house.city}, ${house.state} ${house.zipCode}`}</p>
                <div>
                  <p className="ml-1 mt-2 text-sm text-gray-500 text-center">
                    {`Created on ${dayjs(house.createdAt).format("dddd MM/DD")}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex text-center">
            <div className="flex flex-col">
              <h5 className="text-lg">
                {house.serviceType === "type_1" ? "Package 1" : "Package 2"}
              </h5>
              <p className="text-lg font-semibold">
                {dynamicQuoteGenerator(
                  allCachedRegionData[house.region][
                    house.serviceType as keyof RegionData
                  ],
                  house.sqft || 0
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              <p className="text-md text-gray-700">
                {house.configType === "config_1"
                  ? "Configuration 1 selected"
                  : "Configuration 2 selected"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold md:mt-8">
                Your request for service has been received.
              </h2>
              <p className="mt-1 inline-block text-xl"> We will reach out via email shortly!</p>
            </div>
          </div>
          <div>
            <div>
              <button className="mt-8 rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Download quote as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
export default HouseIndex;

type HouseParams = {
  houseId: string;
};

export async function getStaticPaths() {
  const res: House[] = await prisma.house.findMany();
  console.log("GETTING STATIC PATHS");

  // Get the paths we want to pre-render based on posts
  const paths = res.map((house) => ({
    params: { houseId: house.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: HouseParams }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1

  const house = await prisma.house.findUnique({
    where: { id: params.houseId },
  });

  if (!house) return { props: { house: null, error: true } };

  // Pass post data to the page via props
  return {
    props: { house: { ...house, createdAt: house.createdAt?.toISOString(), } },
  };
}
