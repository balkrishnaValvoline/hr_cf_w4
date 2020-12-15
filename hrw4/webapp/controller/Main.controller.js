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
		}

	});
});