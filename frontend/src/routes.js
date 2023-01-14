import Home from "./pages/Home.svelte";
import Participants from "./pages/members/Members.svelte";
import MemberDetail from "./pages/members/MemberDetail.svelte";
import CreateMember from "./pages/members/CreateMember.svelte";
import Sections from "./pages/sections/Sections.svelte";
import SectionDetail from "./pages/sections/SectionDetail.svelte";
import CreateSection from "./pages/sections/CreateSection.svelte";

export default {
    '/': Home,
    '/home': Home,

    '/members': Participants,
    '/members/:id': MemberDetail,
    '/addMember': CreateMember,

    '/sections': Sections,
    '/sections/:id': SectionDetail,
    '/addSection': CreateSection,
}