import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
            About
          </Link>
          <Link href="/docs" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
            Documentation
          </Link>
          <Link href="#" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
            Privacy
          </Link>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} DeepFake Detect Research. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
