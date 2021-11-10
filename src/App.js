import React from 'react';
import { connect } from "react-redux";
const LightApp = React.lazy(() => import("./LightApp"))
const DarkApp = React.lazy(() => import("./DarkApp"))


function App({ mode }) {
  // const [state, setState] = useState(mode);
  // const handleMode = () => {
  //   console.log(mode)
  //   if (mode !== "dark") {
  //     require("./assets/scss/dark.scss")
  //   }
  //   else {
  //     delete require.cache[require.resolve('./assets/scss/dark.scss')]
  //     require("./assets/scss/themes.scss")
  //   }
  // }

  // useEffect(() => {
  //   setState(mode)
  // }, [mode])
  return (
    mode === "dark" ? <DarkApp /> : <LightApp />
  );
}
const mapStateToProps = (state) => {
  const { mode } = state.Layout;
  return { mode };
};
export default (connect(mapStateToProps, {}))(App);
// import React, { useEffect } from 'react';
// import { connect } from "react-redux";
// // const LightApp = React.lazy(() => import("./LightApp"))
// // const DarkApp = React.lazy(() => import("./DarkApp"))
// import Routes from './routes/';


// function App({ mode }) {
//   const handleMode = () => {
//     console.log(mode)
//     if (mode !== "dark") {
//       require("./assets/scss/dark.scss")
//     }
//     else {
//       delete require.cache[require.resolve('./assets/scss/dark.scss')]
//       require("./assets/scss/themes.scss")
//     }
//   }

//   useEffect(() => {
//     handleMode()
//   }, [mode])
//   return (
//     // mode === "dark" ? <DarkApp /> : <LightApp />
//     <Routes />
//   );
// }
// const mapStateToProps = (state) => {
//   const { mode } = state.Layout;
//   return { mode };
// };
// export default (connect(mapStateToProps, {}))(App);
