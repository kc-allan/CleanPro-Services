import AppAppBar from "./AppAppBar";
const PageNotFound = () => {
  return (
	<div>
	  <AppAppBar />
	  <div style={{backgroundImage:"url(static/images/404.gif)", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition:"center"}}
	  className="h-screen mt-10">
	  </div>
	</div>
  );
}

export default PageNotFound;