package valv.hr.connectivity.rfc.structures;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class PO_ADDRESS {

	@JsonProperty
	String CONAME;
	
	@JsonProperty
	String COUNTRY2;
	
	@JsonProperty
	String ZIPCODE;
	
	@JsonProperty
	String STATE;
	
	@JsonProperty
	String STREET;
	
	@JsonProperty
	String COUNTRYKEY;
	
	@JsonProperty
	String ADDRESSLINE;
	
	@JsonProperty
	String EMPLOYEENUMBER;
	
	@JsonProperty
	String CITY;
	
	@JsonProperty
	String COUNTRY;
	
	@JsonProperty
	String STATEKEY;
	
	@JsonProperty
	String EMPLOYEENAME;
	
	@JsonProperty
	String COUNTY;

	public String getCONAME() {
		return CONAME;
	}

	public void setCONAME(String cONAME) {
		CONAME = cONAME;
	}

	public String getCOUNTRY2() {
		return COUNTRY2;
	}

	public void setCOUNTRY2(String cOUNTRY2) {
		COUNTRY2 = cOUNTRY2;
	}

	public String getZIPCODE() {
		return ZIPCODE;
	}

	public void setZIPCODE(String zIPCODE) {
		ZIPCODE = zIPCODE;
	}

	public String getSTATE() {
		return STATE;
	}

	public void setSTATE(String sTATE) {
		STATE = sTATE;
	}

	public String getSTREET() {
		return STREET;
	}

	public void setSTREET(String sTREET) {
		STREET = sTREET;
	}

	public String getCOUNTRYKEY() {
		return COUNTRYKEY;
	}

	public void setCOUNTRYKEY(String cOUNTRYKEY) {
		COUNTRYKEY = cOUNTRYKEY;
	}

	public String getADDRESSLINE() {
		return ADDRESSLINE;
	}

	public void setADDRESSLINE(String aDDRESSLINE) {
		ADDRESSLINE = aDDRESSLINE;
	}

	public String getEMPLOYEENUMBER() {
		return EMPLOYEENUMBER;
	}

	public void setEMPLOYEENUMBER(String eMPLOYEENUMBER) {
		EMPLOYEENUMBER = eMPLOYEENUMBER;
	}

	public String getCITY() {
		return CITY;
	}

	public void setCITY(String cITY) {
		CITY = cITY;
	}

	public String getCOUNTRY() {
		return COUNTRY;
	}

	public void setCOUNTRY(String cOUNTRY) {
		COUNTRY = cOUNTRY;
	}

	public String getSTATEKEY() {
		return STATEKEY;
	}

	public void setSTATEKEY(String sTATEKEY) {
		STATEKEY = sTATEKEY;
	}

	public String getEMPLOYEENAME() {
		return EMPLOYEENAME;
	}

	public void setEMPLOYEENAME(String eMPLOYEENAME) {
		EMPLOYEENAME = eMPLOYEENAME;
	}

	public String getCOUNTY() {
		return COUNTY;
	}

	public void setCOUNTY(String cOUNTY) {
		COUNTY = cOUNTY;
	}

}
