sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel'
], function (Controller, DateFormat, MessageBox, JSONModel) {
	"use strict";
	var _oController;
	var _oRouter;
	return Controller.extend("valvoline.ui.hrw4.controller.Overview", {
		/**
		 * This function is called when the app is loaded
		 * @function onInit
		 */
		onInit: function () {
			_oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			_oRouter.getRoute("RouteOverview").attachPatternMatched(this._onObjectMatched, this);
			_oController = this;
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
			_oController.getView().byId("idbegDate").setMinDate(new Date());
			_oController.getView().byId("idendDate").setMinDate(new Date());

			_oController.loginSvc();
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
					_oController.getView().byId("idUserFName").setText(data.FNAME);
					_oController.getView().byId("idUserLName").setText(data.LNAME);
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
							pattern: "MM/dd/yyyy/hh:mm:ss"
						});
						var sdateFormatDisplay = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "MM/dd/yyyy"
						});
						if (data.length === 0) {
							_oController.getView().byId("idCreate").setEnabled(true);
						} else {
							_oController.getView().byId("idCreate").setEnabled(false);
							for (var i = 0; i < data.length; i++) {

								var sBeginDate = sdateFormat.format(new Date(data[i].BEGDA));
								var sBeginDateDisplay = sdateFormatDisplay.format(new Date(data[i].BEGDA));
								var sEndDate = sdateFormat.format(new Date(data[i].ENDDA));
								var sEndDateDisplay = sdateFormatDisplay.format(new Date(data[i].ENDDA));
								var sLastChangedDate = sdateFormatDisplay.format(new Date(data[i].AEDTM));

								var sValid = "";
								var sDelete = false;
								var today = new Date();
								var sBeginDatey = new Date(data[i].BEGDA);
								var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
								var backendBeginDate = new Date(sBeginDatey.getFullYear(), sBeginDatey.getMonth(), sBeginDatey.getDate(), 0, 0, 0);
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
								var recordBeginDateDisplayEdit;
								// for backdated rcords set the begdate as curret date
								if ((data[i].BEGDA) < new Date()) {
									recordBeginDateDisplayEdit = sdateFormat.format(new Date());
								} else {
									recordBeginDateDisplayEdit = sdateFormat.format(new Date(data[i].BEGDA));
								}
								_oController.getOwnerComponent().getModel("w4DataModel").getData().tableEditRecords.push(data[i]);
								_oController.getOwnerComponent().getModel("w4DataModel").getData().tableRecords.push({
									recordBeginDateDisplayEdit: recordBeginDateDisplayEdit,
									recordBeginDate: sBeginDate,
									recordEndDate: sEndDate,
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
			_oController.getOwnerComponent().getModel("w4DataModel").getData().editSaveRecords[0].recordDeclare = true;

			_oController.getOwnerComponent().getModel("w4DataModel").updateBindings();
			_oController.handleEditOverview(oEvent, _oController.sKeyEdit);

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

			MessageBox.success("Do you want to delete this record", {
				actions: ["YES", "NO"],
				emphasizedAction: "NO",
				width: "150%",
				height: "150%",
				title: "Delete Record?",

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

						MessageBox.success("Record ready for Edit", {
							actions: ["OK"],
							emphasizedAction: "OK",
							width: "150%",
							height: "150%",
							title: "Messages:",
							errorDetails: message,

							onClose: function (sAction) {
								if (sAction === "OK") {
									//				_oController.handleEmptyData();
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

						});
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
									_oController.getTableRecords();
									_oController.handlePrevDelete(oEvent);
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
									_oController.getTableRecords();
									_oController.handlePrevDelete(oEvent);
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
				this.getView().byId("idEditTab").setEnabled(false);
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
			MessageBox.success("Do you want to create a New Record?", {
				actions: ["Yes", MessageBox.Action.CLOSE],
				emphasizedAction: "Yes",
				width: "150%",
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
			if (_oController.getView().byId("idDeclare").getSelected() === false) {
				MessageBox.error("Please fill all the mandatory fields", {
					actions: ["OK"],
					emphasizedAction: "OK",
					width: "150%",
					height: "150%",
					title: "Mandatory fields",

					onClose: function (sAction) {
						if (sAction === "OK") {
							if (_oController.getView().byId("idDeclare").getSelected() === false) {
								if (_oController.getView().byId("idDeclare").getSelected() === false) {
									_oController.getView().byId("idDeclare").addStyleClass("checkBoxdeclare");
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

			var beginDate = new Date(_oController.getView().byId("idbegDate").getValue());
			beginDate.setUTCHours(0, 0, 0);
			var millisecondsBegin = beginDate.getTime();
			var endDate = new Date(_oController.getView().byId("idendDate").getValue());
			endDate.setUTCHours(0, 0, 0);
			var millisecondsEnd = endDate.getTime();

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
				"TXSTA": _oController.getView().byId("filingStatus").getSelectedKey(),
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
										_oController.getTableRecords();
										_oController.handlePrevEdit(oEvent);
									}
								}

							});
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
													_oController.getTableRecords();
													_oController.handlePrevEdit(oEvent);
												}
											}

										});
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
									_oController.getTableRecords();
									_oController.handlePrevEdit(oEvent);
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
		handleDateChange: function (oEvt) {
			oEvt.getSource().setValueState("None");
		}

	});
});