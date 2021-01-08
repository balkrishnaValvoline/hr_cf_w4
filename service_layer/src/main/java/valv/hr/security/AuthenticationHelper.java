package valv.hr.security;

import java.util.Base64;
import java.util.Base64.Decoder;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.sap.cloud.security.token.AccessToken;


public final class AuthenticationHelper {
	
	private static final Logger logger = LoggerFactory.getLogger(AuthenticationHelper.class);
	
	private static AuthenticationHelper instance;
	private static final String SESSION_HR_USER = "HR_USER";
	
	public static synchronized AuthenticationHelper getInstance() {
		if (instance == null) {
			instance = new AuthenticationHelper();
		}
		return instance;
	}

	
	public HRUser getAuthenticatedUser(HttpServletRequest request) {
		logger.trace("[ENTER] getAuthenticatedUser: {}", request.getSession());
		HRUser hrUser = null;
		if(request.getUserPrincipal() == null) {
			logger.info("Authentication Failed - No User Principal Found");
		}else {
			logger.trace("[USER Login]: {}", request.getUserPrincipal().getName());
			
			try {
				logger.trace("SESSION_HR_USER: {}", request.getSession().getAttribute(SESSION_HR_USER)!=null?request.getSession().getAttribute(SESSION_HR_USER).toString():null);
				
				// retrieve the user from session
				hrUser = (HRUser) request.getSession().getAttribute(SESSION_HR_USER);
				
				if (hrUser == null) {
					logger.trace("[HR User] Create and initialize the session user");
					hrUser = this.getUserFromSession(request);
				}
				logger.trace("[HRUser]: {}", hrUser.toString());
			}finally {
				logger.trace("[EXIT] getAuthenticatedUser");
			}
		}
		return hrUser;
	}


	private HRUser getUserFromSession(HttpServletRequest request) {
		logger.trace("[ENTER] getUserFromSession");
		HRUser hrUser = null;
		AccessToken accessTokenPrincipal = (AccessToken) request.getUserPrincipal();
		
		String accessToken = accessTokenPrincipal.getTokenValue();
		if (accessToken != null && !accessToken.equals("")) {
			logger.trace("[HRUser] Create and initialize the session user");
			hrUser = this.getHRUser(accessToken);
			logger.trace("[HRUser] Logged user: {}", hrUser.toString());
			// save the user in session
			request.getSession().setAttribute(SESSION_HR_USER, hrUser);
		}else {
			logger.error("[JWT token null]");
			logger.info("[Authentication Failed]");
		}
		return hrUser;
	}
	
	private HRUser getHRUser(String userToken) throws JSONException{
		logger.trace("[ENTER] getHRUser");
		HRUser user = null;
		JSONObject userAtr = this.getUserAttributes(userToken);
		if(userAtr != null) {
			user = new HRUser();
			JSONObject xsAttr = userAtr.getJSONObject("xs.user.attributes");
			user.setFirstName(xsAttr.getJSONArray("givenName").getString(0));
			user.setLastName(xsAttr.getJSONArray("lastName").getString(0));
			user.setFrID(xsAttr.getJSONArray("frID").getString(0));
			user.setUserId(xsAttr.getJSONArray("UserName").getString(0));
		}
		return user;
	}
	
	private JSONObject getUserAttributes(String tokenValue) {
		logger.trace("[ENTER] getUserAttributes");
		try {
			DecodedJWT jwt = JWT.decode(tokenValue);
			String payload = jwt.getPayload();
			Decoder decoder = Base64.getDecoder();
			String tokenVal = new String(decoder.decode(payload));
			JSONObject tokenObj = new JSONObject(tokenVal);
			return tokenObj;
		}catch(JWTDecodeException e) {
			logger.error("Error in reading JWT - {}",tokenValue);
			return null;
		}
		
	}
}
