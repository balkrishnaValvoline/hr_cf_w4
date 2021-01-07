sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel'
], function (Controller, DateFormat, MessageBox, JSONModel) {
	"use strict";
	var _oController;
	var _oRouter;

	return Controller.extend("valvoline.ui.hrw4.controller.CreateSave", {
		/**
		 * This function is called on the initial load of page. 
		 * @function onInit
		 */
		onInit: function () {
			_oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			_oRouter.getRoute("RouteCreateSave").attachPatternMatched(this._onObjectMatched, this);
			_oController = this;

		},
		/**
		 * This function is called everytime this page is called. 
		 * @function _onObjectMatched
		 */
		_onObjectMatched: function (oEvent) {

			if (!_oController.dialog) {
				_oController.dialog = sap.ui.xmlfragment("valvoline.ui.hrw4.fragment.BusyDialog", this);
			}
			var stoday = new Date();
			stoday.setUTCHours(0, 0, 0);
			var dateToday = new Date(stoday.getUTCFullYear(), stoday.getUTCMonth(), stoday.getUTCDate(), 0, 0, 0);
			_oController.getView().byId("idbegDateSave").setMinDate(dateToday);
			_oController.getView().byId("idendDateSave").setMinDate(dateToday);
			_oController.dialog.open();
			_oController.getEditDetails();

		},
		/**
		 * This function is called for the createNew Service. 
		 * @function getEditDetails
		 */
		getEditDetails: function (oEvent) {

			$.ajax({
				url: "/backend/hrservices/w4/createNew",

				success: function (data) {

					for (var i = 0; i < data.F4_HELP.TXSTA.length; i++) {
						_oController.getOwnerComponent().getModel("w4DataModel").getData().editFilingStatusData.push({
							filingKey: data.F4_HELP.TXSTA[i].VALUEKEY,
							filingValue: data.F4_HELP.TXSTA[i].VALUETEXT
						});

					}

					for (var j = 0; j < data.F4_HELP.EXIND.length; j++) {
						_oController.getOwnerComponent().getModel("w4DataModel").getData().editExemptionData.push({
							exemptionKey: data.F4_HELP.EXIND[j].VALUEKEY,
							exemptionValue: data.F4_HELP.EXIND[j].VALUETEXT
						});
					}
					_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.addressData.push({
						addressLine: data.ADDRS_DATA.ADDRESSLINE,
						city: data.ADDRS_DATA.CITY,
						coname: data.ADDRS_DATA.CONAME,
						country: data.ADDRS_DATA.COUNTRY,
						country2: data.ADDRS_DATA.COUNTRY2,
						countrykey: data.ADDRS_DATA.COUNTRYKEY,
						county: data.ADDRS_DATA.COUNTY,
						empName: data.EMPLOYEENAME,
						empNumber: data.EMPLOYEENUMBER,
						state: data.ADDRS_DATA.STATE,
						stateKey: data.ADDRS_DATA.STATEKEY,
						street: data.ADDRS_DATA.STREET,
						ZIP: data.ADDRS_DATA.ZIPCODE
					});
					_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.personalData.push({
						lastChanged: data.PERS_DATA.AEDTM,
						anred: data.PERS_DATA.ANRED,
						anrex: data.PERS_DATA.ANREX,
						anzkd: data.PERS_DATA.ANZKD,
						beginDate: data.PERS_DATA.BEGDA,
						ename: data.PERS_DATA.ENAME,
						endDate: data.PERS_DATA.ENDDA,
						famdt: data.PERS_DATA.FAMDT,
						famst: data.PERS_DATA.FAMST,
						fatxt: data.PERS_DATA.FATXT,
						gbdat: data.PERS_DATA.GBDAT,
						gesch: data.PERS_DATA.GESCH,
						gestx: data.PERS_DATA.GESTX,
						inits: data.PERS_DATA.INITS,
						itbld: data.PERS_DATA.ITBLD,
						knznm: data.PERS_DATA.KNZNM,
						MName: data.PERS_DATA.MIDNM,
						na2tx: data.PERS_DATA.NA2TX,
						na3tx: data.PERS_DATA.NA3TX,
						nach2: data.PERS_DATA.NACH2,
						LName: data.PERS_DATA.NACHN,
						name2: data.PERS_DATA.NAME2,
						namzu: data.PERS_DATA.NAMZU,
						nati2: data.PERS_DATA.NATI2,
						nati3: data.PERS_DATA.NATI3,
						natio: data.PERS_DATA.NATIO,
						nattx: data.PERS_DATA.NATTX,
						objectKey: data.PERS_DATA.OBJECT_KEY,
						serialNumber: data.PERS_DATA.PERID,
						pernr: data.PERS_DATA.PERNR,
						rufnm: data.PERS_DATA.RUFNM,
						sprps: data.PERS_DATA.SPRPS,
						sprsl: data.PERS_DATA.SPRSL,
						sprtx: data.PERS_DATA.SPRTX,
						sptxt: data.PERS_DATA.SPTXT,
						titL2: data.PERS_DATA.TITL2,
						uname: data.PERS_DATA.UNAME,
						fName: data.PERS_DATA.VORNA
					});
					_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.messages.push({
						messages: data.MESSAGES
					});
					var nameDiffer = data.W4_DATA.LNMCH;
					var nameDifferVal;
					if (nameDiffer === "X") {
						nameDifferVal = true;
					} else {
						nameDifferVal = false;
					}
					var useHoldings = data.W4_DATA.MULT_JOBS_IND;
					var useHoldingsVal;
					if (useHoldings === "X") {
						useHoldingsVal = true;
					} else {
						useHoldingsVal = false;
					}
					_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4oldRecord.push({
						oldRec: data.W4_DATA
					});

					var sdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "MM/dd/yyyy"
					});
					var sEndDatey = new Date(data.W4_DATA.ENDDA);
					sEndDatey.setUTCHours(0, 0, 0, 0);
					var sEnd = new Date(sEndDatey.getUTCFullYear(), sEndDatey.getUTCMonth(), sEndDatey.getUTCDate(), 0, 0, 0);
					var sBeginDatey = new Date(data.W4_DATA.BEGDA);
					sBeginDatey.setUTCHours(0, 0, 0, 0);
					var sBegin = new Date(sBeginDatey.getUTCFullYear(), sBeginDatey.getUTCMonth(), sBeginDatey.getUTCDate(), 0, 0, 0);
					_oController.getOwnerComponent().getModel("w4DataModel").getData()
						.editRecords.W4Data.push({
							adexa: data.W4_DATA.ADEXA,
							adexn: data.W4_DATA.ADEXN,
							lastChanged: data.W4_DATA.AEDTM,
							amtex: data.W4_DATA.AMTEX,
							beginDate: sdateFormat.format(sBegin),
							currency1: data.W4_DATA.CURR1,
							currency2: data.W4_DATA.CURR2,
							currency3: data.W4_DATA.CURR3,
							deductionAmt: data.W4_DATA.DEDUCT_AMT,
							depex: data.W4_DATA.DEPEX,
							totalCredits: data.W4_DATA.DEPS_TOTAL_AMT,
							eicst: data.W4_DATA.EICST,
							eicst1: data.W4_DATA.EICST01,
							endDate: sdateFormat.format(sEnd),
							examt: data.W4_DATA.EXAMT,
							exind: data.W4_DATA.EXIND,
							expct: data.W4_DATA.EXPCT,
							frmdt: data.W4_DATA.FRMDT,
							frmnd: data.W4_DATA.FRMND,
							frmnr: data.W4_DATA.FRMNR,
							frmnt: data.W4_DATA.FRMNT,
							irsli: data.W4_DATA.IRSLI,
							itbld: data.W4_DATA.ITBLD,
							lnmch: nameDifferVal,
							ltext1: data.W4_DATA.LTEXT01,
							ltext2: data.W4_DATA.LTEXT02,
							useHoldings: useHoldingsVal,
							nbqlc: data.W4_DATA.NBQLC,
							nbrex: data.W4_DATA.NBREX,
							nratx: data.W4_DATA.NRATX,
							objectKey: data.W4_DATA.OBJECT_KEY,
							otherCredits: data.W4_DATA.OTHER_INC_AMT,
							perex: data.W4_DATA.PEREX,
							perner: data.W4_DATA.PERNR,
							rwamt: data.W4_DATA.RWAMT,
							rwamt_curr: data.W4_DATA.RWAMT_CURR,
							sprps: data.W4_DATA.SPRPS,
							sprtx: data.W4_DATA.SPRTX,
							taurt: data.W4_DATA.TAURT,
							taxlv1: data.W4_DATA.TAXLV01,
							taxlv2: data.W4_DATA.TAXLV02,
							txsta: data.W4_DATA.TXSTA,
							uname: data.W4_DATA.UNAME,
							declare: false
						});

					if (_oController.getOwnerComponent().getModel("w4DataModel").getData()
						.editRecords
						.W4Data[0].txsta === "00") {

						_oController.getView().byId("filingStatus").setValue("");

					} else {
						_oController.getView().byId("filingStatus").setSelectedKey(_oController.getOwnerComponent().getModel("w4DataModel").getData()
							.editRecords
							.W4Data[0].txsta);

					}
					_oController.getView().byId("idExemption").setSelectedKey(_oController.getOwnerComponent().getModel(
							"w4DataModel").getData()
						.editRecords
						.W4Data[0].exind);
					_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
					_oController.dialog.close();
				},
				error: function (err, xhr) {
					_oController.dialog.close();
				}
			});
		},
		/**
		 * This function is called for the going back to overview page. 
		 * @function onPrevToMain
		 */
		onPrevToMain: function (oEvent) {
			_oRouter.navTo("RouteOverview");
		},
		/**
		 * This function is for user confirmation about SAVE. 
		 * @function onConfirm
		 */
		onConfirm: function (oEvent) {
			if (_oController.getView().byId("idDeclare").getSelected() === false || _oController.getView().byId("idbegDateSave").getValue() ===
				"" || _oController.getView().byId("filingStatus").getValue() ===
				"") {
				MessageBox.error("Please fill all the mandatory fields", {
					actions: ["OK"],
					emphasizedAction: "OK",
					width: "150%",
					height: "150%",
					title: "Mandatory fields",

					onClose: function (sAction) {
						if (sAction === "OK") {
							if (_oController.getView().byId("idDeclare").getSelected() === false || _oController.getView().byId("idbegDateSave").getValue() ===
								"" || _oController.getView().byId("filingStatus").getValue() ===
								"") {
								if (_oController.getView().byId("idDeclare").getSelected() === false) {
									_oController.getView().byId("idDeclare").addStyleClass("checkBoxdeclare");
								}
								if (_oController.getView().byId("idbegDateSave").getValue() === "") {
									_oController.getView().byId("idbegDateSave").setValueState("Error");
								}
								if (_oController.getView().byId("filingStatus").getValue() === "") {
									_oController.getView().byId("filingStatus").setValueState("Error");
								}

							}
						}
					}
				});
			} else {
				MessageBox.success("Do you want to save this entry", {
					actions: ["YES", "NO"],
					emphasizedAction: "YES",
					width: "150%",
					height: "150%",
					title: "Save",

					onClose: function (sAction) {
						if (sAction === "YES") {
							_oController.onSaveRecord(oEvent);

						} else {
							oEvent.getSource().close();
						}
					}
				});
			}
		},

		onDeclareSelect: function (oEvent) {

			_oController.getView().byId("idDeclare").removeStyleClass("checkBoxdeclare");

		},
		/**
		 * This function is for saving Record. 
		 * @function onSaveRecord
		 */
		onSaveRecord: function (oEvent) {
			_oController.dialog.open();
			var w4Data = _oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4Data;
			var sUseCheck = "";
			var sNameCheck;
			if (_oController.getView().byId("idUseCheck").getSelected() === true) {
				sUseCheck = "X";
			} else {
				sUseCheck = "";
			}
			if (_oController.getView().byId("idNamediffer").getSelected() === true) {
				sNameCheck = "X";
			} else {
				sNameCheck = "";
			}
			var sFiling = _oController.getView().byId("filingStatus").getValue();
			var sFilingValue;
			if (sFiling === "") {
				sFilingValue = "";
			} else {
				sFilingValue = _oController.getView().byId("filingStatus").getSelectedKey();
			}

			var beginDate = new Date(_oController.getView().byId("idbegDateSave").getValue());

			var millisecondsBegin = Date.UTC(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate(), 0, 0, 0, 0);
			var endDate = new Date(_oController.getView().byId("idendDateSave").getValue());

			var millisecondsEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0, 0);

			var sNewW4DataPayload = {
				"ADEXA": parseFloat(w4Data[0].adexa),
				"ADEXN": w4Data[0].adexn,
				"AEDTM": null,
				"AMTEX": w4Data[0].amtex,
				"BEGDA": millisecondsBegin,
				"CURR1": w4Data[0].currency1,
				"CURR2": w4Data[0].currency2,
				"CURR3": w4Data[0].currency3,
				"DEDUCT_AMT": parseFloat(_oController.getView().byId("deductionCredits").getValue()),
				"DEPEX": w4Data[0].depex,
				"DEPS_TOTAL_AMT": parseFloat(_oController.getView().byId("totalCredits").getValue()),
				"EICST": w4Data[0].eicst,
				"EICST01": w4Data[0].eicst1,
				"ENDDA": millisecondsEnd,
				"EXAMT": parseFloat(_oController.getView().byId("idAdditional").getValue()),
				"EXIND": _oController.getView().byId("idExemption").getSelectedKey(),
				"EXPCT": parseFloat(w4Data[0].expct),
				"FRMDT": w4Data[0].frmdt,
				"FRMND": w4Data[0].frmnd,
				"FRMNR": w4Data[0].frmnr,
				"FRMNT": w4Data[0].frmnt,
				"IRSLI": w4Data[0].irsli,
				"ITBLD": w4Data[0].itbld,
				"LNMCH": sNameCheck,
				"LTEXT01": w4Data[0].ltext1,
				"LTEXT02": w4Data[0].ltext2,
				"MULT_JOBS_IND": sUseCheck,
				"NBQLC": w4Data[0].nbqlc,
				"NBREX": w4Data[0].nbrex,
				"NRATX": w4Data[0].nratx,
				"OBJECT_KEY": w4Data[0].objectKey,
				"OTHER_INC_AMT": parseFloat(_oController.getView().byId("otherCredits").getValue()),
				"PEREX": w4Data[0].perex,
				"PERNR": w4Data[0].perner,
				"RWAMT": w4Data[0].rwamt,
				"RWAMT_CURR": w4Data[0].rwamt_curr,
				"SPRPS": w4Data[0].sprps,
				"SPRTX": w4Data[0].sprtx,
				"TAURT": w4Data[0].taurt,
				"TAXLV01": w4Data[0].taxlv1,
				"TAXLV02": w4Data[0].taxlv2,
				"TXSTA": sFilingValue,
				"UNAME": w4Data[0].uname
			};
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4oldRecord[0].oldRec.AEDTM = null;
			var sSaveW4DataPayload = {
				"OLD_RECORD": _oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4oldRecord[0].oldRec,
				"NEW_RECORD": sNewW4DataPayload
			};
			$.ajax({
				data: JSON.stringify(sSaveW4DataPayload),
				url: "/backend/hrservices/w4/saveRecord",
				method: "POST",
				contentType: "application/json",
				dataType: "json",
				success: function (data) {
					var sMessage = [];
					var errorDetails = "<ul>";
					_oController.dialog.close();
					if (data[0] !== undefined) {

						errorDetails += "<li>" + data[0].MESSAGE +
							"</li>";

						if (data[0].TYPE !== "E") {
							MessageBox.success("Successful creation of new record", {
								actions: ["OK"],
								emphasizedAction: "OK",
								width: "150%",
								height: "150%",
								title: "Successful Creation",
								details: errorDetails,
								onClose: function (sAction) {
									if (sAction === "OK") {
										oEvent.getSource().close();
										_oRouter.navTo("RouteOverview");
									}
								}

							});
						} else {
							MessageBox.error("Unsuccesful creation of new record", {
								actions: ["OK"],
								emphasizedAction: "OK",
								width: "150%",
								height: "150%",
								title: "Unsuccessful Creation",
								details: errorDetails,
								onClose: function (sAction) {
									if (sAction === "OK") {
										oEvent.getSource().close();
									}
								}

							});
						}
					} else if (data.MESSAGES !== undefined) {
						if (data.MESSAGES) {
							if (data.MESSAGES.length) {
								for (var mk = 0; mk < data.MESSAGES.length; mk++) {
									if (data.MESSAGES[mk] !== "") {
										errorDetails += "<li>" + data.MESSAGES[mk].MESSAGE +
											"</li>";
									}
								}
							}
							if (!data.MESSAGES.length) {
								errorDetails += "<li>" + data.MESSAGES.MESSAGE +
									"</li>";
							}
						}

						MessageBox.success("Successful creation of new record", {
							actions: ["OK"],
							emphasizedAction: "OK",
							width: "150%",
							height: "150%",
							title: "Successful Creation",
							details: errorDetails,
							onClose: function (sAction) {
								if (sAction === "OK") {
									oEvent.getSource().close();
									_oRouter.navTo("RouteOverview");
								}
							}

						});
					} else if (data.MESSAGE !== undefined) {
						sMessage.push(data[0].MESSAGE);
						sMessage.push(data[0].MESSAGE_V1);
						sMessage.push(data[0].MESSAGE_V2);
						sMessage.push(data[0].MESSAGE_V3);
						sMessage.push(data[0].MESSAGE_V4);
						errorDetails = "<ul>";
						for (var m = 0; m < sMessage.length; m++) {
							if (sMessage[m] !== "") {
								errorDetails += "<li>" + sMessage[m] + "</li>";
							}
						}

						if (data[0].TYPE === "E") {
							MessageBox.error("Unsuccesful creation of new record", {
								actions: ["OK"],
								emphasizedAction: "OK",
								width: "150%",
								height: "150%",
								title: "Unsuccessful Creation",
								details: errorDetails,
								onClose: function (sAction) {
									if (sAction === "OK") {
										oEvent.getSource().close();
									}
								}

							});
						}

					} else {
						MessageBox.error("Unsuccesful creation of new record", {
							actions: ["OK"],
							emphasizedAction: "OK",
							width: "150%",
							height: "150%",
							title: "Unsuccessful Creation",

							onClose: function (sAction) {
								if (sAction === "OK") {
									oEvent.getSource().close();
								}
							}

						});
					}

				},
				error: function (err, xhr) {
					_oController.dialog.close();
					if (err.statusText) {
						if (err.responseText) {
							var errorResp = err.responseText;
							if (errorResp.length) {
								var errorDetails = "<ul>";
								errorDetails += "<li>" + errorResp + "</li>";
							}
						}

						MessageBox.error(err.statusText, {
							actions: ["OK"],
							emphasizedAction: "OK",
							width: "150%",
							height: "150%",
							title: "Unsuccessful Creation",
							details: errorDetails,
							onClose: function (sAction) {
								if (sAction === "OK") {
									oEvent.getSource().close();
								}
							}

						});
					}
				}

			});
		},
		/**
		 * This function is called when Date is changed. 
		 * @function handleDateChange
		 */
		handleDateChange: function (oEvt) {
			oEvt.getSource().setValueState("None");
		},
		/**
		 * This function is called when Filing is changed. 
		 * @function onFilingChang
		 */
		onFilingChange: function (oEvent) {
			oEvent.getSource().setValueState("None");
		},
		/**
		 * This function is called when logout is pressed. 
		 * @function logoutPress
		 */
		logoutPress: function () {
			sap.m.URLHelper.redirect("/do/logout", false);
		}

	});
});