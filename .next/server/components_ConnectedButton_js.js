/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "components_ConnectedButton_js";
exports.ids = ["components_ConnectedButton_js"];
exports.modules = {

/***/ "./components/ConnectedButton.js":
/*!***************************************!*\
  !*** ./components/ConnectedButton.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ ConnectedButton; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _terra_money_wallet_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @terra-money/wallet-provider */ \"@terra-money/wallet-provider\");\n/* harmony import */ var _terra_money_wallet_provider__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_terra_money_wallet_provider__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar _jsxFileName = \"/Users/0xantman/Developer/loterra/loterra-interface-v2-react/components/ConnectedButton.js\";\n\nfunction ConnectedButton({}) {\n  const {\n    status,\n    network,\n    wallets,\n    availableConnectTypes,\n    connect,\n    disconnect\n  } = (0,_terra_money_wallet_provider__WEBPACK_IMPORTED_MODULE_1__.useWallet)();\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"section\", {\n      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"pre\", {\n        children: JSON.stringify({\n          status,\n          network,\n          wallets,\n          availableConnectTypes\n        }, null, 2)\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 16,\n        columnNumber: 9\n      }, this)\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 15,\n      columnNumber: 7\n    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"section\", {\n      style: {\n        margin: \"20px 0\"\n      },\n      children: status === _terra_money_wallet_provider__WEBPACK_IMPORTED_MODULE_1__.WalletStatus.WALLET_NOT_CONNECTED ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: availableConnectTypes.map(connectType => /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n          onClick: () => connect(connectType),\n          children: [\"Connect with \", connectType]\n        }, connectType, true, {\n          fileName: _jsxFileName,\n          lineNumber: 34,\n          columnNumber: 15\n        }, this))\n      }, void 0, false) : status === _terra_money_wallet_provider__WEBPACK_IMPORTED_MODULE_1__.WalletStatus.WALLET_CONNECTED ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n        onClick: () => disconnect(),\n        children: \"Disconnect\"\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 40,\n        columnNumber: 11\n      }, this) : null\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 30,\n      columnNumber: 7\n    }, this)]\n  }, void 0, true);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sb3RlcnJhLy4vY29tcG9uZW50cy9Db25uZWN0ZWRCdXR0b24uanM/ZTFkYyJdLCJuYW1lcyI6WyJDb25uZWN0ZWRCdXR0b24iLCJzdGF0dXMiLCJuZXR3b3JrIiwid2FsbGV0cyIsImF2YWlsYWJsZUNvbm5lY3RUeXBlcyIsImNvbm5lY3QiLCJkaXNjb25uZWN0IiwidXNlV2FsbGV0IiwiSlNPTiIsInN0cmluZ2lmeSIsIm1hcmdpbiIsIldhbGxldFN0YXR1cyIsIm1hcCIsImNvbm5lY3RUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBRWUsU0FBU0EsZUFBVCxDQUF5QixFQUF6QixFQUE2QjtBQUMxQyxRQUFNO0FBQ0pDLFVBREk7QUFFSkMsV0FGSTtBQUdKQyxXQUhJO0FBSUpDLHlCQUpJO0FBS0pDLFdBTEk7QUFNSkM7QUFOSSxNQU9GQyx1RUFBUyxFQVBiO0FBU0Esc0JBQ0U7QUFBQSw0QkFDRTtBQUFBLDZCQUNFO0FBQUEsa0JBQ0dDLElBQUksQ0FBQ0MsU0FBTCxDQUNDO0FBQ0VSLGdCQURGO0FBRUVDLGlCQUZGO0FBR0VDLGlCQUhGO0FBSUVDO0FBSkYsU0FERCxFQU9DLElBUEQsRUFRQyxDQVJEO0FBREg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFERixlQWdCRTtBQUFTLFdBQUssRUFBRTtBQUFFTSxjQUFNLEVBQUU7QUFBVixPQUFoQjtBQUFBLGdCQUNHVCxNQUFNLEtBQUtVLDJGQUFYLGdCQUNDO0FBQUEsa0JBQ0dQLHFCQUFxQixDQUFDUSxHQUF0QixDQUEyQkMsV0FBRCxpQkFDekI7QUFBMEIsaUJBQU8sRUFBRSxNQUFNUixPQUFPLENBQUNRLFdBQUQsQ0FBaEQ7QUFBQSxzQ0FDZ0JBLFdBRGhCO0FBQUEsV0FBYUEsV0FBYjtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUREO0FBREgsdUJBREQsR0FRR1osTUFBTSxLQUFLVSx1RkFBWCxnQkFDRjtBQUFRLGVBQU8sRUFBRSxNQUFNTCxVQUFVLEVBQWpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBREUsR0FFQTtBQVhOO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFoQkY7QUFBQSxrQkFERjtBQWdDRCIsImZpbGUiOiIuL2NvbXBvbmVudHMvQ29ubmVjdGVkQnV0dG9uLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlV2FsbGV0LCBXYWxsZXRTdGF0dXMgfSBmcm9tIFwiQHRlcnJhLW1vbmV5L3dhbGxldC1wcm92aWRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25uZWN0ZWRCdXR0b24oe30pIHtcbiAgY29uc3Qge1xuICAgIHN0YXR1cyxcbiAgICBuZXR3b3JrLFxuICAgIHdhbGxldHMsXG4gICAgYXZhaWxhYmxlQ29ubmVjdFR5cGVzLFxuICAgIGNvbm5lY3QsXG4gICAgZGlzY29ubmVjdCxcbiAgfSA9IHVzZVdhbGxldCgpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxzZWN0aW9uPlxuICAgICAgICA8cHJlPlxuICAgICAgICAgIHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgICAgICBuZXR3b3JrLFxuICAgICAgICAgICAgICB3YWxsZXRzLFxuICAgICAgICAgICAgICBhdmFpbGFibGVDb25uZWN0VHlwZXMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIDJcbiAgICAgICAgICApfVxuICAgICAgICA8L3ByZT5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgPHNlY3Rpb24gc3R5bGU9e3sgbWFyZ2luOiBcIjIwcHggMFwiIH19PlxuICAgICAgICB7c3RhdHVzID09PSBXYWxsZXRTdGF0dXMuV0FMTEVUX05PVF9DT05ORUNURUQgPyAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIHthdmFpbGFibGVDb25uZWN0VHlwZXMubWFwKChjb25uZWN0VHlwZSkgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17Y29ubmVjdFR5cGV9IG9uQ2xpY2s9eygpID0+IGNvbm5lY3QoY29ubmVjdFR5cGUpfT5cbiAgICAgICAgICAgICAgICBDb25uZWN0IHdpdGgge2Nvbm5lY3RUeXBlfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvPlxuICAgICAgICApIDogc3RhdHVzID09PSBXYWxsZXRTdGF0dXMuV0FMTEVUX0NPTk5FQ1RFRCA/IChcbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGRpc2Nvbm5lY3QoKX0+RGlzY29ubmVjdDwvYnV0dG9uPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvc2VjdGlvbj5cbiAgICA8Lz5cbiAgKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/ConnectedButton.js\n");

/***/ })

};
;