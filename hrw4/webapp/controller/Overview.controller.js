sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel'
], function (Controller, DateFormat, MessageBox, JSONModel) {
	"use strict";
	var _oController;
	var _oRouter;
	var _isSessionTimeOut = false;
	return Controller.extend("valvoline.ui.hrw4.controller.Overview", {
		/**
		 * This function is called when the app is loaded
		 * @function onInit
		 */
		onInit: function () {
			_oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			_oRouter.getRoute("RouteOverview").attachPatternMatched(this._onObjectMatched, this);
			_oController = this;
			if (!_oController.dialog) {
				_oController.dialog = sap.ui.xmlfragment("valvoline.ui.hrw4.fragment.BusyDialog", this);
			}
			sap.ui.getCore().sLoginFlag = true;
			sap.ui.getCore().sCreateSaveFlag = false;
			_oController.idleTimeSetup();

		},
		/**
		 * This function is called everytime the page is loaded
		 * @function _onObjectMatched
		 */
		_onObjectMatched: function (oEvent) {

			_oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (!_oController.dialog) {
				_oController.dialog = sap.ui.xmlfragment("valvoline.ui.hrw4.fragment.BusyDialog", this);
			}
			var stoday = new Date();
			stoday.setUTCHours(0, 0, 0);
			var dateToday = new Date(stoday.getUTCFullYear(), stoday.getUTCMonth(), stoday.getUTCDate(), 0, 0, 0);
			_oController.getView().byId("idbegDate").setMinDate(dateToday);

			if (sap.ui.getCore().sLoginFlag === true) {
				var editRecords = {
					"addressData": [],
					"messages": [],
					"personalData": [],
					"W4Data": [],
					"W4oldRecord": []
				};

				var deleteRecords = {
					"oldDeleteRecords": [],
					"newDeleteRecords": []

				};
				var w4Data = {
					"tableRecords": [],
					"tableEditRecords": [],
					"deleteTabRecords": [],
					"editTabRecords": [],
					"editSaveRecords": [],
					"deleteRecords": deleteRecords,
					"editFilingStatusData": [],
					"editExemptionData": [],
					"editBindingsFilingStatusData": [],
					"editBindingsExemptionData": [],
					"editRecords": editRecords,
					"editBindings": []
				};
				_oController.getOwnerComponent().getModel("w4DataModel").setData(w4Data);
				if (sap.ui.getCore().sCreateSaveFlag === false) {
					_oController.loginSvc();
				} else {
					_oController.getTableRecords();
					sap.ui.getCore().sCreateSaveFlag = true;
				}
				sap.ui.getCore().sLoginFlag = false;
			}
			var oComboBox = _oController.getView().byId("filingStatus");
			oComboBox.addEventDelegate({
				onAfterRendering: function () {
					oComboBox.$().find("input").attr("readonly", true);
				}
			});

		},
		/**
		 * This function is used for calling the login service, to check if user is authorized or not
		 * @function loginSvc
		 */
		loginSvc: function () {

			$.ajax({
				url: "/backend/hrservices/w4/loginSvc",
				async: false,
				success: function (data) {
					_oController.dialog.open();
					sap.ui.getCore().sFname = data.FNAME;
					sap.ui.getCore().sLname = data.LNAME;
					_oController.getView().byId("idUserFName").setText(data.FNAME);
					_oController.getView().byId("idUserLName").setText(data.LNAME);
					sap.ui.getCore().PERNER = data.EMPLNO;
					_oController.getTableRecords();

				},
				error: function (err, xhr) {
					_oController.getView().byId("idIconTabBar").setVisible(false);

					if (err.statusText === "Unauthorized") {
						_oController.getView().byId("idNotFound").setText(_oController.getResourceBundle().getText("unAuthorized"));

					} else {
						_oController.getView().byId("idNotFound").setText(_oController.getResourceBundle().getText("notFound"));
					}
					_oController.getView().byId("idNotFound").setVisible(true);
				}
			});

		},
		/**
		 * This function is called for getting the table records on overview tab
		 * @function getTableRecords
		 */
		getTableRecords: function (oEvent) {

			if (_oController.getOwnerComponent().getModel("w4DataModel").getData().tableRecords.length === 0) {
				$.ajax({
					url: "/backend/hrservices/w4/fedRecords",
					async: false,
					success: function (data) {

						var sdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "MM/dd/yyyy"
						});

						if (data.length === 0) {
							_oController.getView().byId("idCreate").setEnabled(true);
						} else {
							_oController.getView().byId("idCreate").setEnabled(false);
							if (data[0].TYPE === undefined)
							{
								for (var i = 0; i < data.length; i++) {

									var sBeginDate = sdateFormat.format(new Date(data[i].BEGDA));
									var sEstBegin = new Date(data[i].BEGDA);
									var sBeginDateDisplay = (sEstBegin.getUTCMonth() <= 9 ? ("0" + (sEstBegin.getUTCMonth() + 1)) : (sEstBegin.getUTCMonth() +
										1)) + "/" + (sEstBegin.getUTCDate() <= 9 ? "0" + sEstBegin.getUTCDate() : sEstBegin.getUTCDate()) + "/" + sEstBegin.getUTCFullYear();

									var sEstEnd = new Date(data[i].ENDDA);
									var sEndDateDisplay = (sEstEnd.getUTCMonth() <= 9 ? ("0" + (sEstEnd.getUTCMonth() + 1)) : (sEstEnd.getUTCMonth() +
										1)) + "/" + (sEstEnd.getUTCDate() <= 9 ? "0" + sEstEnd.getUTCDate() : sEstEnd.getUTCDate()) + "/" + sEstEnd.getUTCFullYear();
									var sEstLast = new Date(data[i].AEDTM);
									var sLastChangedDate = (sEstLast.getUTCMonth() <= 9 ? ("0" + (sEstLast.getUTCMonth() + 1)) : (sEstLast.getUTCMonth() +
										1)) + "/" + (sEstLast.getUTCDate() <= 9 ? "0" + sEstLast.getUTCDate() : sEstLast.getUTCDate()) + "/" + sEstLast.getUTCFullYear();

									var sValid = "";
									var sDelete = false;
									var today = new Date();
									today.setUTCHours(0, 0, 0, 0);
									var sBeginDatey = new Date(data[i].BEGDA);
									sBeginDatey.setUTCHours(0, 0, 0, 0);
									var myToday = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0);
									var backendBeginDate = new Date(sBeginDatey.getUTCFullYear(), sBeginDatey.getUTCMonth(), sBeginDatey.getUTCDate(), 0, 0,
										0);
									if (backendBeginDate > myToday) {
										sDelete = true;
									} else {
										sDelete = false;
									}
									_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteRecords.oldDeleteRecords.push({

										oldData: data[i]
									});
									_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteRecords.newDeleteRecords.push({

										newData: data[i]
									});
									var sEndDatey = new Date(data[i].ENDDA);
									sEndDatey.setUTCHours(0, 0, 0, 0);
									var sEndDate = new Date(sEndDatey.getUTCFullYear(), sEndDatey.getUTCMonth(), sEndDatey.getUTCDate(), 0, 0, 0);

									var recordBeginDateDisplayEdit;
									// for backdated rcords set the begdate as current date

									if (backendBeginDate < myToday) {
										recordBeginDateDisplayEdit = sdateFormat.format(myToday);
									} else {
										recordBeginDateDisplayEdit = sdateFormat.format(backendBeginDate);
									}
									_oController.getOwnerComponent().getModel("w4DataModel").getData().tableEditRecords.push(data[i]);
									_oController.getOwnerComponent().getModel("w4DataModel").getData().tableRecords.push({
										recordBeginDateDisplayEdit: recordBeginDateDisplayEdit,
										recordBeginDate: sBeginDate,
										recordEndDate: sdateFormat.format(sEndDate),
										recordAEDTM: data[i].AEDTM,
										recordBEGDA: data[i].BEGDA,
										recordENDDA: data[i].ENDDA,
										recordDelete: sDelete,
										recordValid: sValid,
										recordValidTo: sEndDateDisplay,
										recordValidFrom: sBeginDateDisplay,
										recordFilingStatus: data[i].LTEXT02,
										recordExemption: data[i].NBREX,
										recordLast: sLastChangedDate,
										recordADEXA: data[i].ADEXA,
										recordADEXN: data[i].ADEXN,
										recordAMTEX: data[i].AMTEX,
										recordCURR1: data[i].CURR1,
										recordCURR2: data[i].CURR2,
										recordCURR3: data[i].CURR3,
										recordDEDUCT_AMT: data[i].DEDUCT_AMT,
										recordDEPEX: data[i].DEPEX,
										recordDEPS_TOTAL_AMT: data[i].DEPS_TOTAL_AMT,
										recordEICST: data[i].EICT,
										recordEICST01: data[i].EICST01,
										recordEXAMT: data[i].EXAMT,
										recordEXIND: data[i].EXIND,
										recordEXPCT: data[i].EXPCT,
										recordFRMDT: data[i].FRMDT,
										recordFRMND: data[i].FRMND,
										recordFRMNR: data[i].FRMNR,
										recordFRMNT: data[i].FRMNT,
										recordIRSLI: data[i].IRSLI,
										recordITBLD: data[i].ITBLD,
										recordLNMCH: data[i].LNMCH,
										recordLTEXT01: data[i].LTEXT01,
										recordLTEXT02: data[i].LTEXT02,
										recordMULT_JOBS_IND: data[i].MULT_JOBS_IND,
										recordNBQLC: data[i].NBQLC,
										recordNBREX: data[i].NBREX,
										recordNRATX: data[i].NRATX,
										recordOBJECT_KEY: data[i].OBJECT_KEY,
										recordOTHER_INC_AMT: data[i].OTHER_INC_AMT,
										recordPEREX: data[i].PEREX,
										recordPERNR: data[i].PERNR,
										recordRWAMT: data[i].RWAMT,
										recordRWAMT_CURR: data[i].RWAMT_CURR,
										recordSPRPS: data[i].SPRPS,
										recordSPRTX: data[i].SPRTX,
										recordTAURT: data[i].TAURT,
										recordTAXLV01: data[i].TAXLV01,
										recordTAXLV02: data[i].TAXLV02,
										recordTXSTA: data[i].TXSTA,
										recordUNAME: data[i].UNAME,
									});

								}
							}
							if (data[0].TYPE === "E") {
								_oController.dialog.close();
								MessageBox.error(data[0].MESSAGE, {
									actions: ["OK"],
									emphasizedAction: "OK",
									width: "150%",
									height: "150%",
									title: "Fetching Unsuccessful",

									onClose: function (sAction) {
										if (sAction === "OK") {
											oEvent.getSource().close();

										}
									}

								});
							}
						}
						_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
						_oController.getView().byId("idIconTabBar").setVisible(true);
						_oController.getView().byId("idNotFound").setVisible(false);
						_oController.dialog.close();

					},
					error: function (err, xhr) {
						_oController.dialog.close();
					}
				});
			}
		},
		/**
		 * This function is called when delete button is pressed 
		 * @function handleDeleteClick
		 */
		handleDeleteClick: function (oEvent) {

			_oController.sKey = oEvent.getSource().getBindingContext("w4DataModel").getPath().split("/")[2];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteTabRecords.push(_oController.getOwnerComponent().getModel(
				"w4DataModel").getData().tableRecords[_oController.sKey]);
			if (_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteTabRecords[0].recordLNMCH === "X") {
				_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteTabRecords[0].recordLNMCH = true;
			}
			if (_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteTabRecords[0].recordLNMCH === "") {
				_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteTabRecords[0].recordLNMCH = false;
			}
			_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
			_oController.getView().byId("idIconTabBar").setSelectedKey("2");
			_oController.getView().byId("idDelRecord").setVisible(true);
			_oController.getView().byId("idEditRecord").setVisible(false);
			_oController.getView().byId("idEditTab").setVisible(true);
			_oController.getView().byId("toEdit").setVisible(true);

		},
		/**
		 * This function is called when edit button is pressed 
		 * @function handleEditClick
		 */
		handleEditClick: function (oEvent) {

			_oController.sKeyEdit = oEvent.getSource().getBindingContext("w4DataModel").getPath().split("/")[2];

			_oController.getOwnerComponent().getModel("w4DataModel").getData().editTabRecords.push(_oController.getOwnerComponent().getModel(
				"w4DataModel").getData().tableRecords[_oController.sKeyEdit]);
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords.push(_oController.getOwnerComponent().getModel(
				"w4DataModel").getData().tableRecords[_oController.sKeyEdit]);
			if (_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordLNMCH === "X") {
				_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordLNMCH = true;
			}
			if (_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordLNMCH === "") {
				_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordLNMCH = false;
			}
			if (_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordMULT_JOBS_IND === "X") {
				_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordMULT_JOBS_IND = true;
			}
			if (_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordMULT_JOBS_IND === "") {
				_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordMULT_JOBS_IND = false;
			}
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordDeclare = false;

			_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
			_oController.dialog.open();
			_oController.handleEditOverview(oEvent, _oController.sKeyEdit);
			_oController.getView().byId("idDeclare").setSelected(false);

		},
		/**
		 * This function is called when previous button is pressed on edit fragment
		 * @function handlePrevEdit
		 */
		handlePrevEdit: function (oEvent) {

			_oController.handleEmptyData();
			_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
			_oController.getTableRecords();
			_oController.getView().byId("idIconTabBar").setSelectedKey("1");
			_oController.getView().byId("idEditTab").setVisible(false);
			_oController.getView().byId("toEdit").setVisible(false);
		},
		/**
		 * This function is called when previous button is pressed on delete fragment
		 * @function handlePrevDelete
		 */
		handlePrevDelete: function (oEvent) {

			_oController.handleEmptyData();
			_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();

			_oController.getTableRecords();

			_oController.getView().byId("idIconTabBar").setSelectedKey("1");
			_oController.getView().byId("idEditTab").setVisible(false);
			_oController.getView().byId("toEdit").setVisible(false);

		},
		/**
		 * This function is called when delete is pressed for any record 
		 * @function handleDelete
		 */
		handleDelete: function (oEvent) {

			var sKey = _oController.sKey;

			MessageBox.success("Do you want to delete this record?", {
				actions: ["YES", "NO"],
				icon: sap.m.MessageBox.Icon.WARNING,
				emphasizedAction: "NO",
				width: "150%",
				height: "150%",
				title: "Delete Record",

				onClose: function (sAction) {
					if (sAction === "YES") {
						_oController.handleDeleteOverview(oEvent, sKey);
						_oController.dialog.open();
					} else {
						oEvent.getSource().close();
					}
				}

			});
		},
		/**
		 * This function is called for editing the record. 
		 * @function handleEditOverview
		 */
		handleEditOverview: function (oEvent, sKey) {

			var sdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MM/dd/yyyy"
			});
			var sdateStr = sdateFormat.format(new Date());
			this.getView().byId("idDate").setText(sdateStr);
			var sData = _oController.getOwnerComponent().getModel("w4DataModel").getData().tableEditRecords[sKey];

			var sEditData = JSON.stringify(sData);
			$.ajax({
				data: sEditData,
				url: "/backend/hrservices/w4/editRecord",
				method: "POST",
				contentType: "application/json",
				dataType: "json",
				async: true,
				success: function (data) {
					if (data[0] === undefined)

					{
						_oController.handleNullData();
						_oController.getView().byId("idIconTabBar").setSelectedKey("2");
						_oController.getView().byId("idEditRecord").setVisible(true);
						_oController.getView().byId("idDelRecord").setVisible(false);
						_oController.getView().byId("idEditTab").setVisible(true);
						_oController.getView().byId("toEdit").setVisible(true);
						var message = "";
						_oController.getOwnerComponent().getModel("w4DataModel").getData().editBindings.push(data);
						_oController.getOwnerComponent().getModel("w4DataModel").getData().editBindingsFilingStatusData.push(data.F4_HELP.TXSTA);
						_oController.getOwnerComponent().getModel("w4DataModel").getData().editBindingsExemptionData.push(data.F4_HELP.EXIND);
						_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
						_oController.dialog.close();
						if (data.MESSAGES !== null) {
							var errorDetails = "<ul>";
							for (var k = 0; k < data.MESSAGES.length; k++) {
								errorDetails += "<li>" + data.MESSAGES[k].MESSAGE + "</li>";
							}
							message = errorDetails;
						}

						if (data.MESSAGES !== null) {
							if (message === "<ul>") {
								var sExempt = _oController.getOwnerComponent().getModel(
										"w4DataModel").getData()
									.editSaveRecords[0].recordEXIND;
								var sFiling = _oController.getOwnerComponent().getModel(
										"w4DataModel").getData()
									.editSaveRecords[0].recordTXSTA;

								_oController.getView().byId("idExemption").setSelectedKey(sExempt);
								if (sFiling === "00") {
									_oController.getView().byId("filingStatus").setValue();

								} else {
									_oController.getView().byId("filingStatus").setSelectedKey(sFiling);
								}
								/*	MessageBox.success("Record ready for Edit", {
										actions: ["OK"],
										emphasizedAction: "OK",
										width: "150%",
										height: "150%",
										title: "Messages",

										onClose: function (sAction) {
											if (sAction === "OK") {
											
												oEvent.getSource().close();
												var sExempt = _oController.getOwnerComponent().getModel(
														"w4DataModel").getData()
													.editSaveRecords[0].recordEXIND;
												var sFiling = _oController.getOwnerComponent().getModel(
														"w4DataModel").getData()
													.editSaveRecords[0].recordTXSTA;

												_oController.getView().byId("idExemption").setSelectedKey(sExempt);
												if (sFiling === "00") {
													_oController.getView().byId("filingStatus").setValue();

												} else {
													_oController.getView().byId("filingStatus").setSelectedKey(sFiling);
												}
											}
										}

									});*/
							} else {
								/*MessageBox.success("Record ready for Edit", {
									actions: ["OK"],
									emphasizedAction: "OK",
									width: "150%",
									height: "150%",
									title: "Messages",
									errorDetails: message,

									onClose: function (sAction) {
										if (sAction === "OK") {
										
											oEvent.getSource().close();
											var sExempt = _oController.getOwnerComponent().getModel(
													"w4DataModel").getData()
												.editSaveRecords[0].recordEXIND;
											var sFiling = _oController.getOwnerComponent().getModel(
													"w4DataModel").getData()
												.editSaveRecords[0].recordTXSTA;

											_oController.getView().byId("idExemption").setSelectedKey(sExempt);
											if (sFiling === "00") {
												_oController.getView().byId("filingStatus").setValue();

											} else {
												_oController.getView().byId("filingStatus").setSelectedKey(sFiling);
											}
										}
									}

								});*/

								var sExempts = _oController.getOwnerComponent().getModel(
										"w4DataModel").getData()
									.editSaveRecords[0].recordEXIND;
								var sFilings = _oController.getOwnerComponent().getModel(
										"w4DataModel").getData()
									.editSaveRecords[0].recordTXSTA;

								_oController.getView().byId("idExemption").setSelectedKey(sExempts);
								if (sFiling === "00") {
									_oController.getView().byId("filingStatus").setValue();

								} else {
									_oController.getView().byId("filingStatus").setSelectedKey(sFilings);
								}
							}
						}
						if (data.MESSAGES === undefined) {
							MessageBox.error("Edit Unsuccessful", {
								actions: ["OK"],
								emphasizedAction: "OK",
								width: "150%",
								height: "150%",
								title: "Edit Unsuccessful",

								onClose: function (sAction) {
									if (sAction === "OK") {
										oEvent.getSource().close();

									}
								}

							});
						}
					}
					if (data[0] !== undefined) {
						_oController.dialog.close();
						if (data[0].TYPE !== undefined) {
							if (data[0].TYPE === "E") {
								MessageBox.error(data[0].MESSAGE, {
									actions: ["OK"],
									emphasizedAction: "OK",
									width: "150%",
									height: "150%",
									title: "Edit Unsuccessful",
									details: errorDetails,
									onClose: function (sAction) {
										if (sAction === "OK") {
											oEvent.getSource().close();

										}
									}

								});
							}
						}
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
							title: "Edit Unsuccessful",
							details: errorDetails,
							onClose: function (sAction) {
								if (sAction === "OK") {
									oEvent.getSource().close();

								}
							}

						});
					}
					_oController.dialog.close();
				}

			});
		},
		/**
		 * This function is called for clearing the model data. 
		 * @function handleNullData
		 */
		handleNullData: function (oEvent) {

			_oController.getOwnerComponent().getModel("w4DataModel").getData().tableRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteRecords.oldDeleteRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteRecords.newDeleteRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.addressData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.messages = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.personalData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4Data = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4oldRecord = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editExemptionData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editFilingStatusData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteTabRecords = [];

			_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
		},
		/**
		 * This function is called for clearing the model nodes. 
		 * @function handleEmptyData
		 */
		handleEmptyData: function () {

			_oController.getOwnerComponent().getModel("w4DataModel").getData().tableEditRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().tableRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteRecords.oldDeleteRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteRecords.newDeleteRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.addressData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.messages = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.personalData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4Data = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editRecords.W4oldRecord = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editExemptionData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editFilingStatusData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().deleteTabRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editTabRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editBindings = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editBindingsFilingStatusData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editBindingsExemptionData = [];
			_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
		},
		/**
		 * This function is called for deleting a record. 
		 * @function handleDeleteOverview
		 */
		handleDeleteOverview: function (oEvent, sKey) {

			var sData = _oController.getOwnerComponent().getModel("w4DataModel").getData().deleteRecords.oldDeleteRecords[sKey].oldData;
			var sDeleteData = JSON.stringify(sData);

			$.ajax({
				data: sDeleteData,
				url: "/backend/hrservices/w4/deleteRecord",
				method: "POST",
				contentType: "application/json",
				dataType: "json",
				async: true,
				success: function (data) {
					_oController.dialog.open();
					if (data.MESSAGES === null) {
						MessageBox.success("Deletion Successful", {
							actions: ["OK"],
							emphasizedAction: "OK",
							width: "150%",
							height: "150%",
							title: "Deletion Successful",

							onClose: function (sAction) {
								if (sAction === "OK") {

									oEvent.getSource().close();
									_oController.handleEmptyData();
									_oController.handlePrevDelete(oEvent);
									_oController.dialog.close();
								}
							}

						});
					}
					if (data.MESSAGES === undefined) {
						_oController.dialog.close();
						MessageBox.error("Deletion Unsuccessful", {
							actions: ["OK"],
							emphasizedAction: "OK",
							width: "150%",
							height: "150%",
							title: "Deletion Unsuccessful",

							onClose: function (sAction) {
								if (sAction === "OK") {
									oEvent.getSource().close();
									_oController.handleEmptyData();
									_oController.handlePrevDelete(oEvent);
									_oController.dialog.close();
								}
							}

						});
					}

				},
				error: function (err, xhr) {
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
							title: "Deletion Unsuccessful",
							details: errorDetails,
							onClose: function (sAction) {
								if (sAction === "OK") {
									oEvent.getSource().close();
									_oController.handleEmptyData();
									_oController.getTableRecords();
									_oController.handlePrevDelete(oEvent);
									_oController.dialog.close();
								}
							}

						});
					}
					_oController.dialog.close();
				}

			});
		},
		/**
		 * This function is called on click of messge checkbox. 
		 * @function onCheckChange 
		 */
		onCheckChange: function (oEvent) {

			if (oEvent.getSource().getSelected() === true) {
				this.getView().byId("idMessageCall").setVisible(true);
			} else {
				this.getView().byId("idMessageCall").setVisible(false);
			}
		},
		/**
		 * This function is called whenever edit is pressed on any record. 
		 * @function onCheckChangeEdit 
		 */
		onCheckChangeEdit: function (oEvent) {

			if (oEvent.getSource().getSelected() === true) {
				this.getView().byId("idMessageCallEdit").setVisible(true);
			} else {
				this.getView().byId("idMessageCallEdit").setVisible(false);
			}
		},
		/**
		 * This function is called when Next button is clicked. 
		 * @function onNextToSave
		 */
		onNextToSave: function (oEvent) {

			this.getView().byId("saveTab").setEnabled(true);
			this.getView().byId("idIconTabBar").setSelectedKey("3");
			var sdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MM/dd/yyyy"
			});
			var sdateStr = sdateFormat.format(new Date());
			this.getView().byId("idDateSave").setText(sdateStr);
		},
		/**
		 * This function is called for enabling second tab. 
		 * @function onPrevToSave
		 */
		onPrevToSave: function (oEvent) {

			this.getView().byId("idIconTabBar").setSelectedKey("2");
			this.getView().byId("saveTab").setEnabled(false);
		},
		/**
		 * This function is called for any action on icontabbar. 
		 * @function onFilterSelect
		 */
		onFilterSelect: function (oEvent) {

			if (this.getView().byId("idIconTabBar").getSelectedKey() === "1") {
				this.getView().byId("idEditTab").setVisible(false);
				_oController.handlePrevEdit(oEvent);

			}
		},
		/**
		 * This function is called for getting i18n text. 
		 * @function getResourceBundle
		 */
		getResourceBundle: function () {
			return _oController.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		/**
		 * This function is called when logout is pressed. 
		 * @function logoutPress
		 */
		logoutPress: function () {

			sap.m.URLHelper.redirect("/do/logout", false);
		},
		onCreate: function (oEvent) {

			MessageBox.information("Do you want to create a New Record?", {
				actions: ["Yes", MessageBox.Action.CLOSE],
				emphasizedAction: "Yes",
				width: "180%",
				height: "150%",
				title: "Confirm",

				onClose: function (sAction) {
					if (sAction === "Yes") {
						_oRouter.navTo("RouteCreateSave");

					} else {
						oEvent.getSource().close();
					}
				}
			});

		},
		onConfirm: function (oEvent) {

			if (_oController.getView().byId("idDeclare").getSelected() === false || _oController.getView().byId("idbegDate").getValue() ===
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
							if (_oController.getView().byId("idDeclare").getSelected() === false || _oController.getView().byId("idbegDate").getValue() ===
								"" || _oController.getView().byId("filingStatus").getValue() ===
								"") {
								if (_oController.getView().byId("idDeclare").getSelected() === false) {
									_oController.getView().byId("idDeclare").addStyleClass("checkBoxdeclare");
								}
								if (_oController.getView().byId("idbegDate").getValue() === "") {
									_oController.getView().byId("idbegDate").setValueState("Error");
								}
								if (_oController.getView().byId("filingStatus").getValue() === "") {
									_oController.getView().byId("filingStatus").setValueState("Error");
								}

							}
						}
					}
				});
			} else {
				MessageBox.success("Do you want to save this entry ?", {
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
		onSaveRecord: function (oEvent) {

			var sKey = _oController.sKeyEdit;
			_oController.dialog.open();
			var w4Data = _oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords;
			var w4DataOld = _oController.getOwnerComponent().getModel("w4DataModel").getData().editTabRecords;
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

			var beginDate = new Date(_oController.getView().byId("idbegDate").getValue());

			var millisecondsBegin = Date.UTC(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate(), 0, 0, 0, 0);
			var endDate = new Date("12/31/9999");

			var millisecondsEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0, 0);

			var sNewW4DataPayload = {
				"ADEXA": parseFloat(w4Data[0].recordADEXA),
				"ADEXN": w4Data[0].recordADEXN,
				"AEDTM": w4DataOld[0].recordAEDTM,
				"AMTEX": w4Data[0].recordAMTEX,
				"BEGDA": millisecondsBegin,
				"CURR1": w4Data[0].recordCURR1,
				"CURR2": w4Data[0].recordCURR2,
				"CURR3": w4Data[0].recordCURR3,
				"DEDUCT_AMT": parseFloat(_oController.getView().byId("deductionCredits").getValue()),
				"DEPEX": w4Data[0].recordDEPEX,
				"DEPS_TOTAL_AMT": parseFloat(_oController.getView().byId("totalCredits").getValue()),
				"EICST": w4Data[0].recordEICST,
				"EICST01": w4Data[0].recordEICST01,
				"ENDDA": millisecondsEnd,
				"EXAMT": parseFloat(_oController.getView().byId("idAdditional").getValue()),
				"EXIND": _oController.getView().byId("idExemption").getSelectedKey(),
				"EXPCT": parseFloat(w4Data[0].recordEXPCT),
				"FRMDT": w4Data[0].recordFRMDT,
				"FRMND": w4Data[0].recordFRMND,
				"FRMNR": w4Data[0].recordFRMNR,
				"FRMNT": w4Data[0].recordFRMNT,
				"IRSLI": w4Data[0].recordIRSLI,
				"ITBLD": w4Data[0].recordITBLD,
				"LNMCH": sNameCheck,
				"LTEXT01": w4Data[0].recordLTEXT01,
				"LTEXT02": w4Data[0].recordLTEXT02,
				"MULT_JOBS_IND": sUseCheck,
				"NBQLC": w4Data[0].recordNBQLC,
				"NBREX": w4Data[0].recordNBREX,
				"NRATX": w4Data[0].recordNRATX,
				"OBJECT_KEY": w4Data[0].recordOBJECT_KEY,
				"OTHER_INC_AMT": parseFloat(_oController.getView().byId("otherCredits").getValue()),
				"PEREX": w4Data[0].recordPEREX,
				"PERNR": w4Data[0].recordPERNR,
				"RWAMT": w4Data[0].recordRWAMT,
				"RWAMT_CURR": w4Data[0].recordRWAMT_CURR,
				"SPRPS": w4Data[0].recordSPRPS,
				"SPRTX": w4Data[0].recordSPRTX,
				"TAURT": w4Data[0].recordTAURT,
				"TAXLV01": w4Data[0].recordTAXLV01,
				"TAXLV02": w4Data[0].recordTAXLV02,
				"TXSTA": sFilingValue,
				"UNAME": w4Data[0].recordUNAME
			};
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editTabRecords[0].AEDTM = null;
			var sSaveW4DataPayload = {
				"OLD_RECORD": _oController.getOwnerComponent().getModel("w4DataModel").getData().tableEditRecords[sKey],
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
							if (errorDetails === "<ul>") {
								MessageBox.success("Successful creation of new record", {
									actions: ["OK"],
									emphasizedAction: "OK",
									width: "150%",
									height: "150%",
									title: "Successful Creation",

									onClose: function (sAction) {
										if (sAction === "OK") {
											oEvent.getSource().close();
											_oController.handleEmptyData();
											_oController.handlePrevEdit(oEvent);
										}
									}

								});
							} else {
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
											_oController.handleEmptyData();
											_oController.handlePrevEdit(oEvent);
										}
									}

								});
							}
						} else {

							if (data) {
								if (data[0]) {
									if (data[0].TYPE === "E") {

										MessageBox.error("Edit Unsuccesful", {
											actions: ["OK"],
											emphasizedAction: "OK",
											width: "150%",
											height: "150%",
											title: "Edit Unsuccesful",
											details: errorDetails,
											onClose: function (sAction) {
												if (sAction === "OK") {
													oEvent.getSource().close();
												}
											}

										});
									}
									if (data[0].TYPE !== "E") {
										if (errorDetails === "<ul>") {
											MessageBox.success("Successful creation of new record", {
												actions: ["OK"],
												emphasizedAction: "OK",
												width: "150%",
												height: "150%",
												title: "Successful Creation",

												onClose: function (sAction) {
													if (sAction === "OK") {
														oEvent.getSource().close();
														_oController.handleEmptyData();
														_oController.handlePrevEdit(oEvent);
													}
												}

											});
										} else {
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
														_oController.handleEmptyData();
														_oController.handlePrevEdit(oEvent);
													}
												}

											});
										}
									}
								}
							} else {
								MessageBox.error("Edit Unsuccesful", {
									actions: ["OK"],
									emphasizedAction: "OK",
									width: "150%",
									height: "150%",
									title: "Edit Unsuccesful",

									onClose: function (sAction) {
										if (sAction === "OK") {
											oEvent.getSource().close();
										}
									}

								});
							}

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
						if (errorDetails === "<ul>") {
							MessageBox.success("Successful creation of new record", {
								actions: ["OK"],
								emphasizedAction: "OK",
								width: "150%",
								height: "150%",
								title: "Successful Creation",

								onClose: function (sAction) {
									if (sAction === "OK") {
										oEvent.getSource().close();
										_oController.handleEmptyData();
										_oController.handlePrevEdit(oEvent);
									}
								}

							});
						} else {
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
										_oController.handleEmptyData();
										_oController.handlePrevEdit(oEvent);
									}
								}

							});
						}
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
		 * This function is called when Declaration is changed. 
		 * @function onDeclareSelect
		 */
		onDeclareSelect: function (oEvent) {

			_oController.getView().byId("idDeclare").removeStyleClass("checkBoxdeclare");

		},
		/**
		 * This function is called when Filing is changed. 
		 * @function onFilingChang
		 */
		onFilingChange: function (oEvent) {
			oEvent.getSource().setValueState("None");

		},
		handleFiling: function (oEvent) {
			oEvent.getSource().setValue("");

		},
		//Number Validation
		handleNumberChange: function (event) {
			var result;

			var value = event.getSource().getValue().split('');

			var value1 = event.getSource().getValue();
			if (value1 !== "") {
				event.getSource().setValueState("None");
			}
			for (var i = 0; i < value.length; i++) {

				var bNotnumber = isNaN(value[i]);
				if (bNotnumber === false) {
					//	sNumber = value;
				} else {
					if (value[i] === ".") {
						//value = value.join("");
						for (var k = 0; k < value.length; k++) {
							for (var x = 0; x < value.length; x++) {
								if (value[k] === value[x] && k !== x) {
									if (value[x] === ".") {
										if (k > x) {
											value[k] = "";
											value = value.join("");
											event.getSource().setValue(value);

										}
										if (x > k) {
											value[x] = "";
											value = value.join("");
											event.getSource().setValue(value);

										}

									}
								}
							}
						}

					} else {
						value[i] = "";
						value = value.join("");

						event.getSource().setValue(value);
					}

				}
			}

			if (value1.indexOf(".") !== -1) {
				var decimalValue1 = event.getSource().getValue().split(".");
				var deciamlValue = event.getSource().getValue().split(".")[1].split("");
				for (var ij = 0; ij < deciamlValue.length; ij++) {
					if (ij === 0 || ij === 1) {
						var bNotnumber1 = isNaN(deciamlValue[ij]);
						if (bNotnumber1 === false) {
							//	sNumber = deciamlValue;
						} else {
							deciamlValue[ij] = "";
							deciamlValue = deciamlValue.join("");
							result = decimalValue1[0].concat(".").concat(deciamlValue);

							event.getSource().setValue(result);

						}
					} else if (ij > 1) {
						deciamlValue[ij] = "";
						deciamlValue = deciamlValue.join("");
						result = decimalValue1[0].concat(".").concat(deciamlValue);
						event.getSource().setValue(result);

					}

				}
			}

		},
		/**
		 * Setup for timeout validation
		 * @function idleTimeSetup
		 **/
		idleTimeSetup: function () {
			//Initialize idle time values
			window.nIdleTime = 0;
			window.nServiceIdleTime = 0;
			$(document).ready(function () {
				//Increment the idle time counter every minute.
				setInterval(_oController.timerIncrement, 60000); // 1 minute
				//Zero the idle timer on mouse click.
				$(this).click(function (e) {
					//Reset the idle time
					window.nIdleTime = 0;

				});
				//Zero the idle timer on mouse movement.
				$(this).mousemove(function (e) {
					window.nIdleTime = 0;
				});
				$(this).keypress(function (e) {
					window.nIdleTime = 0;
				});

			});
		},
		/**
		 * Handle time increments, service pings and trigger timeout
		 * @function timerIncrement
		 **/
		timerIncrement: function () {

			window.nIdleTime = window.nIdleTime + 60000;

			if (window.nIdleTime >= 600000) { // 10+ minute
				if (!_isSessionTimeOut) {
					sap.m.MessageBox.show(
						"Session is expired, page will be reloaded!", {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Information",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function () {
								_oController.logoutPress();
							}
						}
					);
					_isSessionTimeOut = true;
				}
			}
		}
	});
});