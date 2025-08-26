import "../css/home.css";
import Totalreport from "../report/totalreport";
import Open from "../report/open";
import Progress from "../report/progress";
import Resolved from "../report/resolved";

function Report(){
    return(
        <div class="stats-grid">
            <Totalreport />
            <Open />
            <Progress />
            <Resolved />

        </div>
    )
}

export default Report;