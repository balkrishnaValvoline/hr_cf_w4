package valv.hr.connectivity.jco;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoParameterList;
import com.sap.conn.jco.JCoStructure;

import valv.hr.connectivity.rfc.structures.PI_RECORD;

public class FunctionExecution {
	private static final Logger logger = LoggerFactory.getLogger(FunctionExecution.class);

	private JCoDestination dest;

	public JCoFunction executeRFC(String functionName, Map<String, Object> importParameters) {
		logger.trace("[ENTER] executionRFC");
		dest = RFCConnection.getRFCConnection();
		JCoFunction function = null;
		try {
			function = this.getFunction(functionName);
			if (!importParameters.isEmpty()) {
				// Set import parameters value

				Iterator<Entry<String, Object>> it = importParameters.entrySet().iterator();
				while (it.hasNext()) {
					Entry<String, Object> mapEntry = it.next();
					function.getImportParameterList().setValue(mapEntry.getKey(), mapEntry.getValue());
				}
			}
			try {
				function.execute(dest);
			} catch (JCoException e) {
				logger.error("Error Occurred while executing - {}", functionName);
				logger.error("Error : {}", e.getMessage());
			}

		} catch (JCoException e) {
			logger.error("Function : {} ,Not Found", functionName);
		}
		return function;
	}

	public JCoFunction executeEditDelete(String functionName, Map<String, Object> importParameters) {
		logger.trace("[ENTER] executeEditDelete");
		dest = RFCConnection.getRFCConnection();
		JCoFunction function = null;
		try {
			function = this.getFunction(functionName);
			JCoStructure struct = function.getImportParameterList().getStructure("PI_RECORD");

			if (!importParameters.isEmpty()) {
				// Set Structure Values
				Iterator<Entry<String, Object>> it = importParameters.entrySet().iterator();
				while (it.hasNext()) {
					Entry<String, Object> mapEntry = it.next();
					struct.setValue(mapEntry.getKey(), mapEntry.getValue());
				}
			}
			try {
				function.execute(dest);
			} catch (JCoException e) {
				logger.error("Error Occurred while executing - {}", functionName);
				logger.error("Error : {}", e.getMessage());
			}

		} catch (JCoException e) {
			logger.error("Function : {} ,Not Found", functionName);
		}
		return function;
	}

	private JCoFunction getFunction(String functionName) throws JCoException {
		JCoFunction function = dest.getRepository().getFunction(functionName);
		return function;
	}

	public JCoFunction executeSave(
		String functionName,
			Map<String, Object> importParamOldRec,
			Map<String, Object> importParamNewRec)
	{
		logger.trace("[ENTER] executeEditDelete");
		dest = RFCConnection.getRFCConnection();
		JCoFunction function = null;
		try {
			function = this.getFunction(functionName);
			JCoStructure oldRecStruct = function.getImportParameterList().getStructure("PI_OLD_RECORD");
			JCoStructure newRecStruct = function.getImportParameterList().getStructure("PI_NEW_RECORD");

			this.fillStructureValues(oldRecStruct, importParamOldRec);
			this.fillStructureValues(newRecStruct, importParamNewRec);

			try {
				function.execute(dest);
			} catch (JCoException e) {
				logger.error("Error Occurred while executing - {}", functionName);
				logger.error("Error : {}", e.getMessage());
			}

		} catch (JCoException e) {
			logger.error("Function : {} ,Not Found", functionName);
		}
		return function;
	}

	/**
	 * Method to set Structure Value
	 * @param inpStructure
	 * @param inpValues
	 */
	private void fillStructureValues(JCoStructure inpStructure, Map<String, Object> inpValues) {
		Iterator<Entry<String, Object>> it = inpValues.entrySet().iterator();
		while (it.hasNext()) {
			Entry<String, Object> mapEntry = it.next();
			inpStructure.setValue(mapEntry.getKey(), mapEntry.getValue());
		}
	}
}
