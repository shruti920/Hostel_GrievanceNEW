export function getDashboardRoute(role) {
  switch (role) {
    case "hall_office":
      return "/hall-office";

    case "warden":
      return "/warden";

    case "chief_warden":
      return "/chief-warden";

    default:
      return "/student";
  }
}