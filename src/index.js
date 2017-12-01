// let's go!
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Match, Miss} from "react-router";

import "./css/style.css";
import StorePicker from "./components/StorePicker";
import App from "./components/App";
import notFound from "./components/notFound";

const repo = `/${window.location.pathname.split('/')[1]}`;
const Root = () => {
	return (
		<BrowserRouter basename={repo}>
			<div>
				<Match exactly pattern="/" component={StorePicker} />
				<Match pattern="/store/:storeId" component={App} />
				<Miss component={notFound}/>
			</div>
		</BrowserRouter>
	);
}

render(<Root/>, document.querySelector("#main"));





