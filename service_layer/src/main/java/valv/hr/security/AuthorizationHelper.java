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
	private static final String AUTHORIZED_SESSION_HR_USER = "AUTHORIZED_HR_USER";
	private static final String SESSION_HR_USER = "HR_USER";

	public static synchronized AuthorizationHelper getInstance() {

		if (instance == null) {
			return new AuthorizationHelper();
		}
		return instance;
	}

	public boolean checkCountryAuthorisation(HttpServletRequest httpRequest) {
		logger.debug("[ENTER] checkCountryAuthorisation");

		HRUser authorizedUser = (HRUser) httpRequest.getSession().getAttribute(AUTHORIZED_SESSION_HR_USER);

		if (authorizedUser != null) {
			logger.trace("Authorized HR User Found: {}", authorizedUser.toString());
			return true;
		} else {
			logger.trace("Check and create new user session");
			HRUser hrUser = AuthenticationHelper.getInstance().getAuthenticatedUser(httpRequest);

			Map<String, Object> importParameters = new HashMap<String, Object>();
			importParameters.put("USERNAME", hrUser.getUserId());
			importParameters.put("VALIDBEGIN", new Date());

			FunctionExecution executeFunc = new FunctionExecution();
			JCoFunction funcResp = executeFunc.executeRFC(AppConstants.RFC_NAME_AUTH_CHECK, importParameters);

			if (funcResp != null) {
				String countryGrouping =
					funcResp.getExportParameterList().getField("COUNTRYGROUPING").getValue().toString();
				// Check Country Grouping For US Users = 10
				
				if (countryGrouping.equals("10")) {
					logger.trace("Authorized HR User : {}", hrUser.toString());
					httpRequest.setAttribute("PERNR",
						funcResp.getExportParameterList().getField("EMPLOYEENUMBER").getValue().toString());
					httpRequest.getSession().setAttribute(AUTHORIZED_SESSION_HR_USER, hrUser);
					return true;
				} else {
					// Remove User Session
					logger.trace("Unauthorized User : {}",
						((HRUser) httpRequest.getSession().getAttribute(SESSION_HR_USER)).toString());
					httpRequest.getSession().removeAttribute(SESSION_HR_USER);
					return false;
				}
			} else {
				logger.error("UnAuthorized Access : Authentication RFC Inaccessible");
				return false;
			}

		}
	}

}
