package valv.hr.connectivity.jco;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.conn.jco.JCoDestination;
import com.sap.conn.jco.JCoDestinationManager;
import com.sap.conn.jco.JCoException;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.JCoRepository;

import valv.hr.utility.AppConstants;

/**
 * @author A535396
 *
 */
public final class RFCConnection {
	private static final Logger logger = LoggerFactory.getLogger(RFCConnection.class);
	private static JCoDestination dest;

	/**
	 * Method to establish connection to ABAP
	 * @return
	 */
	public static synchronized JCoDestination getRFCConnection() {
		logger.trace("[ENTER] getRFCConnection");
		if (dest == null) {
			try {
				dest = JCoDestinationManager.getDestination(AppConstants.RFC_DEST_NAME);
			} catch (JCoException e) {
				logger.error("Destination {} Not Found", AppConstants.RFC_DEST_NAME);
			}
		}
		return dest;
	}
	
}
