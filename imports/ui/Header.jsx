import { useTracker } from "meteor/react-meteor-data";
import { useState } from "react";
import Link, { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import React from "react";

import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", protected: false },
  { name: "Impact", href: "#", protected: false },
  { name: "Contact", href: "#", protected: false },
  { name: "Organization", href: "/organization", protected: true, role: "ORG" },
  { name: "Profile", href: "/profile", protected: true},
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useTracker(() => {
    const user = Meteor.user();
    const roles = Roles.getRolesForUser(user?._id);
    return { ...user, roles }; // Combine user and roles into one object
  }, []);

  const nav = useNavigate()

  const loggedIn = !!user._id;

  return (
    <header className="">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="logo.png"
              className="h-10 w-auto rounded-full"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            const hasAccess = !item.protected || (loggedIn && (!item.role || user.roles.includes(item.role)));
            return hasAccess ? (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ) : null;
          })}
          <a href="/events">
            <MagnifyingGlassCircleIcon className="h-6 w-6" />
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {!loggedIn ? (
            <a
              href="/signin"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <a
              href=""
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                Meteor.logout();
                nav("/")
              }}
            >
              Log out <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
