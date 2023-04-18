import {signIn} from "next-auth/react";
import Link from "next/link";
import {useState} from "react";
import Image from "next/image";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="px-6 pt-6 lg:px-8 min-w-full">
      <nav className="flex items-center justify-between" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Pruned</span>
            <Image
              src="/pruned_logo.svg"
              alt={'logo for pruned'}
              width={207}
              height={40}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            {/*// <!-- Heroicon name: outline/bars-3 -->*/}
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href={'/services'} passHref>
            <button
              className="text-sm font-semibold leading-6 text-gray-900">
              Services
            </button>
          </Link>
          <Link href={'/support'} passHref>
            <button
              className="text-sm font-semibold leading-6 text-gray-900">Connect With a Client Specialist
            </button>
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <AuthShowcase />
        </div>
      </nav>
      {/*// <!-- Mobile menu, show/hide based on menu open state. -->*/}
      {!menuOpen ? (<></>) : (
        <div role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Pruned</span>
                <Image
                  src="/3d_pruned_p.svg"
                  alt={'pruned'}
                  width={50}
                  height={43}
                />
              </Link>
              <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700"
                      onClick={() => setMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                {/*// <!-- Heroicon name: outline/x-mark -->*/}
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                     aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link href={'/services'} passHref>
                    <button
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10">Services
                    </button>

                  </Link>
                  <a href="#"
                     className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10">Features</a>

                  <a href="#"
                     className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10">Marketplace</a>

                  <a href="#"
                     className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10">Company</a>
                </div>
                <div className="py-6">
                  <a href="#"
                     className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10">Log
                    in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Nav;

const AuthShowcase: React.FC = () => {
  // const {data: sessionData} = useSession();
  //
  // const {data: secretMessage} = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   {enabled: sessionData?.user !== undefined},
  // );
  //
  // console.log('SECRET MESSAGE', secretMessage)
  const sessionData = false;
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData ? (
        <Link href={'/dashboard/'} passHref>
          <button
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Go to dashboard
            <span
              aria-hidden="true">&rarr;</span>
          </button>
        </Link>
      ) : (
        <button
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => void signIn()}
        >
          Sign in
          <span
            aria-hidden="true">&rarr;</span>
        </button>
      )}
    </div>
  );
};

