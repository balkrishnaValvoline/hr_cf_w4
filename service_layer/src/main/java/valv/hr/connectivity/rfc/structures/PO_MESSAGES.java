package valv.hr.connectivity.rfc.structures;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

/**
 * Table Definition for - PO_MESSAGES
 * 
 * @author Balkrishna.Meena
 *
 */
@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class PO_MESSAGES {

	@JsonProperty
	String SYSTEM;

	@JsonProperty
	String NUMBER;
	
	@JsonProperty
	String FIELD;
	
	@JsonProperty
	String MESSAGE_V2;
	
	@JsonProperty
	String MESSAGE;
	
	@JsonProperty
	String MESSAGE_V3;
	
	@JsonProperty
	String MESSAGE_V4;
	
	@JsonProperty
	String LOG_NO;
	
	@JsonProperty
	String MESSAGE_V1;
	
	@JsonProperty
	String ID;
	
	@JsonProperty
	int ROW;
	
	@JsonProperty
	String TYPE;
	
	@JsonProperty
	String LOG_MSG_NO;
	
	@JsonProperty
	String PARAMETER;

	public String getSYSTEM() {
		return SYSTEM;
	}

	public void setSYSTEM(String sYSTEM) {
		SYSTEM = sYSTEM;
	}

	public String getNUMBER() {
		return NUMBER;
	}

	public void setNUMBER(String nUMBER) {
		NUMBER = nUMBER;
	}

	public String getFIELD() {
		return FIELD;
	}

	public void setFIELD(String fIELD) {
		FIELD = fIELD;
	}

	public String getMESSAGE_V2() {
		return MESSAGE_V2;
	}

	public void setMESSAGE_V2(String mESSAGE_V2) {
		MESSAGE_V2 = mESSAGE_V2;
	}

	public String getMESSAGE() {
		return MESSAGE;
	}

	public void setMESSAGE(String mESSAGE) {
		MESSAGE = mESSAGE;
	}

	public String getMESSAGE_V3() {
		return MESSAGE_V3;
	}

	public void setMESSAGE_V3(String mESSAGE_V3) {
		MESSAGE_V3 = mESSAGE_V3;
	}

	public String getMESSAGE_V4() {
		return MESSAGE_V4;
	}

	public void setMESSAGE_V4(String mESSAGE_V4) {
		MESSAGE_V4 = mESSAGE_V4;
	}

	public String getLOG_NO() {
		return LOG_NO;
	}

	public void setLOG_NO(String lOG_NO) {
		LOG_NO = lOG_NO;
	}

	public String getMESSAGE_V1() {
		return MESSAGE_V1;
	}

	public void setMESSAGE_V1(String mESSAGE_V1) {
		MESSAGE_V1 = mESSAGE_V1;
	}

	public String getID() {
		return ID;
	}

	public void setID(String iD) {
		ID = iD;
	}

	public int getROW() {
		return ROW;
	}

	public void setROW(int rOW) {
		ROW = rOW;
	}

	public String getTYPE() {
		return TYPE;
	}

	public void setTYPE(String tYPE) {
		TYPE = tYPE;
	}

	public String getLOG_MSG_NO() {
		return LOG_MSG_NO;
	}

	public void setLOG_MSG_NO(String lOG_MSG_NO) {
		LOG_MSG_NO = lOG_MSG_NO;
	}

	public String getPARAMETER() {
		return PARAMETER;
	}

	public void setPARAMETER(String pARAMETER) {
		PARAMETER = pARAMETER;
	}
	

}
