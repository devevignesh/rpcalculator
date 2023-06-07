import Image from "next/image";
import Link from "next/link";
import { CurrencyRupeeIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

export default function Header() {
    const { pathname } = useRouter();

    console.log(`router`, pathname);

    return (
        <header className="mt-5 flex w-full items-center justify-between border-b-2 px-2 pb-7 sm:px-4">
            <Link href="/" className="flex items-center space-x-3">
                <CurrencyRupeeIcon className="h-8 w-8 sm:h-12 sm:w-12" width={32} height={32} />
                <h1 className="ml-2 text-2xl font-bold tracking-tight sm:text-4xl">
                    RP Calculator
                </h1>
            </Link>
            {pathname === "/" && (
                <Link
                    href="/tracker"
                    className="rounded-md text-md font-medium text-gray-500 transition-colors ease-out hover:text-black"
                >
                    Tracker
                </Link>
            )}
        </header>
    );
}
