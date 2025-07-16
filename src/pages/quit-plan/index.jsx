import { Routes, Route } from "react-router-dom";
import QuitPlanOverview from "../../components/QuitPlan/Overview/QuitPlanOverview";
import QuitPlan from "../../components/QuitPlan/Detail/QuitPlan";

function QuitPlanPage() {
  return (
    <Routes>
      {/* /quit-plan  */}
      <Route index element={<QuitPlanOverview />} />
      {/* /quit-plan/detail  */}
      <Route path="detail" element={<QuitPlan />} />
    </Routes>
  );
}

export default QuitPlanPage;