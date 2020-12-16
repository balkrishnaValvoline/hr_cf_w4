sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageBox"
], function (Controller, DateFormat, MessageBox) {
	"use strict";
	var _oController;
	return Controller.extend("valvoline.ui.hrw4.controller.Main", {
		onInit: function () {
			_oController = this;
			_oController.loginSvc();
		},

		loginSvc: function () {
	//		var xsURL = "/loginSvc";
				$.ajax({
					url: "/backend/hrservices/w4/loginSvc",
					success: function (data) {
						_oController.getView().byId("idIconTabBar").setVisible(true);
						_oController.getView().byId("idNotFound").setVisible(false);
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
		/*	_oController.handleAjaxJSONCall(_oController, false, xsURL, "GET", _oController.onLoginSuccess,
				_oController.onLoginError);*/
		},
		handleAjaxJSONCall: function (oController, aSync, sEndPoint, sCallType, fSuccess, fError, oDataToSend, oPiggyBack) {
			var oReturn;

			$.ajax({
				beforeSend: function (request) {
					//requesting the CSRF token on every call
					request.setRequestHeader("X-CSRF-Token", "Fetch");
					//POST AND PUT CALLS REQUIRE CSRF TOKEN TO BE SENT
					if (sCallType.toUpperCase() === "POST" || sCallType.toUpperCase() === "PUT" || sCallType.toUpperCase() === "DELETE") {
						request.setRequestHeader("X-CSRF-Token", sap.ui.getCore().getModel("oToken").getData().csrfToken);
					}
					request.setRequestHeader("Content-Type", "application/json");
					// Enables XSS filtering. Rather than sanitizing the page, the browser will prevent rendering of the page if an attack is detected.
					request.setRequestHeader("X-Xss-Protection", " 1; mode=block");
					//Stops the browser from trying to MIME-sniff the content type and forces it to stick with the declared content-type
					request.setRequestHeader("X-Content-Type-Options", "nosniff");
				},
				type: sCallType,
				data: oDataToSend,
				url: "/backend/hrservices/w4/" + sEndPoint,
				async: aSync,
				success: function (oData, textStatus, xhr) {

					if (xhr.getResponseHeader('X-Csrf-Token') !== undefined && xhr.getResponseHeader('X-Csrf-Token') !== null) {

					}
					if (oPiggyBack === undefined) {
						oPiggyBack = {};
					}
					oPiggyBack.textStatus = textStatus;
					oPiggyBack.xhr = xhr;
					oReturn = fSuccess(oController, oData, oPiggyBack);
				},
				error: function (oError) {
				
					if (oError.status === 401 && (oError.getResponseHeader("x-csrf-token") === null || oError.getResponseHeader("x-csrf-token") ===
							undefined || oError.getResponseHeader(
								"x-csrf-token") === "")) {
						//Session was lost triggering logout flow
						//location.reload();
					}

					oReturn = fError(oController, oError, oPiggyBack);
				}

			});
			if (!aSync) {
				return oReturn;
			}

			return oReturn;

		},
		onLoginSuccess: function (oController, oData, oPiggyBack) {
			_oController.getView().byId("idIconTabBar").setVisible(true);
			_oController.getView().byId("idNotFound").setVisible(false);
		},
		onLoginError: function (oController, oError, oPiggyBack) {
			_oController.getView().byId("idIconTabBar").setVisible(false);

			if (oError.statusText === "Unauthorized") {
				_oController.getView().byId("idNotFound").setText(_oController.getResourceBundle().getText("unAuthorized"));

			} else {
				_oController.getView().byId("idNotFound").setText(_oController.getResourceBundle().getText("notFound"));
			}
			_oController.getView().byId("idNotFound").setVisible(true);
		},
		handleDeleteOverview: function (oEvent) {
			this.getView().byId("idEditTab").setEnabled(true);
			this.getView().byId("idDelRecord").setVisible(true);
			this.getView().byId("idEditRecord").setVisible(false);
			this.getView().byId("idIconTabBar").setSelectedKey("2");
			this.getView().byId("saveTab").setEnabled(false);
		},
		handleEditOverview: function (oEvent) {
			this.getView().byId("idEditTab").setEnabled(true);
			this.getView().byId("idEditRecord").setVisible(true);
			this.getView().byId("idDelRecord").setVisible(false);
			this.getView().byId("idIconTabBar").setSelectedKey("2");
			var sdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MM/dd/yyyy"
			});
			var sdateStr = sdateFormat.format(new Date());
			this.getView().byId("idDate").setText(sdateStr);

		},

		onCheckChange: function (oEvent) {
			if (oEvent.getSource().getSelected() === true) {
				this.getView().byId("idMessageCall").setVisible(true);
			} else {
				this.getView().byId("idMessageCall").setVisible(false);
			}
		},
		onCheckChangeEdit: function (oEvent) {
			if (oEvent.getSource().getSelected() === true) {
				this.getView().byId("idMessageCallEdit").setVisible(true);
			} else {
				this.getView().byId("idMessageCallEdit").setVisible(false);
			}
		},
		onNextToSave: function (oEvent) {
			this.getView().byId("saveTab").setEnabled(true);
			this.getView().byId("idIconTabBar").setSelectedKey("3");
			var sdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MM/dd/yyyy"
			});
			var sdateStr = sdateFormat.format(new Date());
			this.getView().byId("idDateSave").setText(sdateStr);
		},
		onPrevToSave: function (oEvent) {
			this.getView().byId("idIconTabBar").setSelectedKey("2");
			this.getView().byId("saveTab").setEnabled(false);
		},
		onConfirm: function (oEvent) {
			MessageBox.success("Do you want to Save this entry?", {
				actions: ["Yes", MessageBox.Action.CLOSE],
				emphasizedAction: "Yes",
				width: "150%",
				height: "150%",
				title: "Save and Confirm",

				onClose: function (sAction) {
					if (sAction === "Yes") {
						_oController.getView().byId("idIconTabBar").setSelectedKey("1");
						_oController.getView().byId("idEditTab").setEnabled(false);
						_oController.getView().byId("saveTab").setEnabled(false);
					} else {
						oEvent.getSource().close();
					}
				}
			});
		},
		onDeleteRecord: function (oEvent) {
			MessageBox.error("Do you want to Delete this entry?", {
				actions: ["Yes", MessageBox.Action.CLOSE],
				emphasizedAction: "Yes",
				width: "150%",
				height: "150%",
				title: "Delete",

				onClose: function (sAction) {
					if (sAction === "Yes") {
						_oController.getView().byId("idIconTabBar").setSelectedKey("1");
						_oController.getView().byId("idEditTab").setEnabled(false);
						_oController.getView().byId("saveTab").setEnabled(false);
					} else {
						oEvent.getSource().close();
					}
				}
			});
		},
		onFilterSelect: function (oEvent) {
			if (this.getView().byId("idIconTabBar").getSelectedKey() === "1") {
				this.getView().byId("idEditTab").setEnabled(false);
				this.getView().byId("saveTab").setEnabled(false);
			}
		},
		getResourceBundle: function () {
			return _oController.getOwnerComponent().getModel("i18n").getResourceBundle();
		}

	});
});