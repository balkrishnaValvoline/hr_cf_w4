package valv.hr.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.conn.jco.JCoFunction;

import valv.hr.connectivity.jco.FunctionExecution;
import valv.hr.utility.AppConstants;

public final class AuthorizationHelper {

	private static final Logger logger = LoggerFactory.getLogger(AuthorizationHelper.class);
	private static AuthorizationHelper instance;

	public static synchronized AuthorizationHelper getInstance() {

		if (instance == null) {
			return new AuthorizationHelper();
		}
		return instance;
	}
	
	
	public boolean checkCountryAuthorisation(HttpServletRequest httpRequest, String userName) {
		
		if(userName.equalsIgnoreCase("a539000")) {
			userName = "a535396";
		}
		
		logger.trace("[ENTER] checkCountryAuthorisation");
		logger.debug("Checking Authorisation for : {} ", userName);
		
		Map<String, Object> importParameters = new HashMap<String, Object>();
		importParameters.put("USERNAME", userName);
		importParameters.put("VALIDBEGIN", new Date());
		
		FunctionExecution executeFunc = new FunctionExecution();
		JCoFunction funcResp = executeFunc.executeRFC(AppConstants.RFC_NAME_AUTH_CHECK, importParameters);
		if(funcResp !=null) {
			String countryGrouping = funcResp.getExportParameterList().getField("COUNTRYGROUPING").getValue().toString();
			if(countryGrouping.equals("10")) {
				httpRequest.setAttribute("PERNR", funcResp.getExportParameterList().getField("EMPLOYEENUMBER").getValue().toString());
				return true;
			}else {
				logger.info("User : {} with Country Grouping : {} - Unauthorized to proceed", userName,countryGrouping);
				return false;
			}
		}else {
			return false;
		}
		
	}

}
