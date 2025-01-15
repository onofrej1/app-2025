import { resources } from "@/resources";
import { Resource } from "@/resources/resources.types";
import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";
import { groupArrayByKey } from "./utils";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

const resourceItems: Menu[] = [];
resources.map((resource) => {
  //const resource = resources[key];
  resourceItems.push({
    label: resource.name,
    href: "/resource/" + resource.resource,
    icon: SquarePen,
    //icon: resource.menuIcon
  });
});

const getSubmenu = (resource: Resource) => {
  return {
    label: resource.name,
    href: "/resource/" + resource.resource,
    icon: SquarePen,
  };
};

const groupedResources = groupArrayByKey(resources, "group");

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: Object.keys(groupedResources).map((key) => {
        return {
          href: "",
          label: key,
          icon: SquarePen,
          submenus: groupedResources[key].map(getSubmenu),
        };
      }),
      /*menus: resourceItems [
        {
          href: "",
          label: "Posts",
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "All Posts"
            },
            {
              href: "/posts/new",
              label: "New Post"
            }
          ]
        },
        {
          href: "/categories",
          label: "Categories",
          icon: Bookmark
        },
        {
          href: "/tags",
          label: "Tags",
          icon: Tag
        }
      ]*/
    },
    {
      groupLabel: "Contacts",
      menus: [
        {
          href: "/conversations",
          label: "Conversations",
          icon: Users,
        },
        {
          href: "/account",
          label: "Friend requests",
          icon: Settings,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users,
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings,
        },
      ],
    },
  ];
}
