export function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function firstUpper(word) {
  return word.charAt(0).toUpperCase();
}

function extractInitials(words) {
  return words
    .split("@")[0]
    .split(/[._-\s]+/)
    .map(word => {
      return firstUpper(word);
    })
    .slice(0, 3)
    .join("");
}

export function avatarInitials(obj) {
  if (obj) {
    if (obj.firstname) {
      let initials = "";
      if (obj.lastname) {
        initials = firstUpper(obj.firstname) + firstUpper(obj.lastname);
      } else {
        initials = firstUpper(obj.firstname);
      }
      return initials;
    }

    if (obj.name) {
      return extractInitials(obj.name);
    }

    if (obj.email) {
      return extractInitials(obj.email);
    }
  }
  return "??";
}

export function roleNames() {
  return [
    { flat: "superuser", nice: "Superuser" },
    { flat: "owner", nice: "Owner" },
    { flat: "admin", nice: "Administrator" },
    { flat: "user", nice: "User" }
  ];
}

export function roleName(role, nice = true) {
  if (!(role > -1 && role < 4)) return "";
  const names = roleNames();
  return nice ? names[role].nice : names[role].flat;
}

export function humanFileSize(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(1) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}
