package valv.hr.security;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HRUser {

	@JsonProperty
	String firstName;

	@JsonProperty
	String lastName;

	@JsonProperty
	String userId;

	@JsonProperty
	String frID;

	@JsonProperty
	String userEmail;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getFrID() {
		return frID;
	}

	public void setFrID(String frID) {
		this.frID = frID;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	
	
}
