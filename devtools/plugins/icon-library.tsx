import React, { useState } from "react";
import { iconNames } from "~/types/icons";
import { Icon, type IconProps, IconSize } from "~/components/Icon";
import { cn } from "~/utils/misc";

// Icon Library part
// Allows you to copy an icon with a toast notification, modify the code to fit your needs
const ClickableIcon = ({ name, size, ...props }: IconProps) => {
  const [clicked, setClicked] = React.useState(false);
  const copyIcon = () => {
    setClicked(true);
    // Shows toast that you copied the icon
    //toast("Copied to clipboard");
    // Writes the icon to the clipboard
    navigator.clipboard.writeText(
      `<Icon name="${name}" size="${size}"${props.className ? ` className="${props.className}"` : ""} />`,
    );
    // Reverts the icon from checked to normal after 1.5 seconds
    setTimeout(() => {
      setClicked(false);
    }, 1500);
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <Icon
          className={cn(
            props.className,
            clicked ? "text-green-500" : "hover:cursor-pointer",
          )}
          // TODO Replace with your own icon to be shown when clicked / remove entirely
          name={clicked ? "favicon" : name}
          size={size}
          onClick={copyIcon}
        />
        <p>{IconSize[size ?? "default"]} px</p>
      </div>
    </>
  );
};

const IconLibrary = () => {
  const [iconClasses, setIconClasses] = useState("");

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
        <label className="text-white">Icon classes:</label>
        <input
          placeholder="Optional classes to apply to icons"
          className="w-full rounded-md bg-gray-100 p-2! text-gray-800! md:w-1/2 xl:w-1/3 dark:bg-gray-800 dark:text-gray-100!"
          value={iconClasses}
          onChange={(e) => setIconClasses(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-md border! border-gray-600! p-2">
        {iconNames.map((key) => {
          return (
            <div key={key} className="flex items-center gap-4 overflow-hidden">
              <div className="w-32 truncate text-right">{key}</div>

              <div className="flex items-center gap-2">
                <ClickableIcon className={iconClasses} size="sm" name={key} />
                <ClickableIcon className={iconClasses} size="md" name={key} />
                <ClickableIcon className={iconClasses} size="lg" name={key} />
                <ClickableIcon className={iconClasses} size="xl" name={key} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
// Export plugin as a function that returns TanStack plugin configuration
export const iconLibraryPlugin = {
  name: "Icon Library",
  id: "icon-library",
  render: <IconLibrary />,
};
