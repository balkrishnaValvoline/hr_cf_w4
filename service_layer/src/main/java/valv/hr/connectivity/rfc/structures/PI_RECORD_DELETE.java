package valv.hr.connectivity.rfc.structures;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

/**
 * Structure Definition for - PI_RECORD, PO_W4_DATA <br>
 * Table Definition for - PO_W4_DATA
 * 
 * @author Balkrishna.Meena
 *
 */
@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class PI_RECORD_DELETE {
	
	@JsonProperty
	String ITBLD;
	
	@JsonProperty
	String FRMNR;
	
	@JsonProperty
	String PERNR;
	
	@JsonProperty
	String FRMNT;
	
	@JsonProperty
	Date ENDDA;
	
	@JsonProperty
	String ADEXN;
	
	@JsonProperty
	String RWAMT_CURR;
	
	@JsonProperty
	String MULT_JOBS_IND;
	
	@JsonProperty
	String FRMDT;
	
	@JsonProperty
	BigDecimal ADEXA;
	
	@JsonProperty
	String CURR2;
	
	@JsonProperty
	String EXIND;
	
	@JsonProperty
	String CURR3;
	
	@JsonProperty
	BigDecimal EXPCT;
	
	@JsonProperty
	String LTEXT01;
	
	@JsonProperty
	String LTEXT02;
	
	@JsonProperty
	BigDecimal EXAMT;
	
	@JsonProperty
	Date BEGDA;
	
	@JsonProperty
	BigDecimal AMTEX;
	
	@JsonProperty
	String LNMCH;
	
	@JsonProperty
	String TAXLV01;
	
	@JsonProperty
	String TAXLV02;
	
	@JsonProperty
	String CURR1;
	
	@JsonProperty
	String OBJECT_KEY;
	
	@JsonProperty
	String IRSLI;
	
	@JsonProperty
	Date AEDTM;
	
	@JsonProperty
	String SPRTX;
	
	@JsonProperty
	String EICST;
	
	@JsonProperty
	String SPRPS;
	
	@JsonProperty
	String RWAMT;
	
	@JsonProperty
	String NRATX;
	
	@JsonProperty
	String UNAME;
	
	@JsonProperty
	String TAURT;
	
	@JsonProperty
	String TXSTA;
	
	@JsonProperty
	BigDecimal DEPS_TOTAL_AMT;
	
	@JsonProperty
	String PEREX;
	
	@JsonProperty
	String FRMND;
	
	@JsonProperty
	BigDecimal OTHER_INC_AMT;
	
	@JsonProperty
	String EICST01;
	
	@JsonProperty
	BigDecimal DEDUCT_AMT;
	
	@JsonProperty
	String NBREX;
	
	@JsonProperty
	String DEPEX;
	
	@JsonProperty
	String NBQLC;

	public String getITBLD() {
		return ITBLD;
	}

	public void setITBLD(String iTBLD) {
		ITBLD = iTBLD;
	}

	public String getFRMNR() {
		return FRMNR;
	}

	public void setFRMNR(String fRMNR) {
		FRMNR = fRMNR;
	}

	public String getPERNR() {
		return PERNR;
	}

	public void setPERNR(String pERNR) {
		PERNR = pERNR;
	}

	public String getFRMNT() {
		return FRMNT;
	}

	public void setFRMNT(String fRMNT) {
		FRMNT = fRMNT;
	}

	public Date getENDDA() {
		return ENDDA;
	}

	public void setENDDA(Date eNDDA) {
		ENDDA = eNDDA;
	}

	public String getADEXN() {
		return ADEXN;
	}

	public void setADEXN(String aDEXN) {
		ADEXN = aDEXN;
	}

	public String getRWAMT_CURR() {
		return RWAMT_CURR;
	}

	public void setRWAMT_CURR(String rWAMT_CURR) {
		RWAMT_CURR = rWAMT_CURR;
	}

	public String getMULT_JOBS_IND() {
		return MULT_JOBS_IND;
	}

	public void setMULT_JOBS_IND(String mULT_JOBS_IND) {
		MULT_JOBS_IND = mULT_JOBS_IND;
	}

	public String getFRMDT() {
		return FRMDT;
	}

	public void setFRMDT(String fRMDT) {
		FRMDT = fRMDT;
	}

	public BigDecimal getADEXA() {
		return ADEXA;
	}

	public void setADEXA(BigDecimal aDEXA) {
		ADEXA = aDEXA;
	}

	public String getCURR2() {
		return CURR2;
	}

	public void setCURR2(String cURR2) {
		CURR2 = cURR2;
	}

	public String getEXIND() {
		return EXIND;
	}

	public void setEXIND(String eXIND) {
		EXIND = eXIND;
	}

	public String getCURR3() {
		return CURR3;
	}

	public void setCURR3(String cURR3) {
		CURR3 = cURR3;
	}

	public BigDecimal getEXPCT() {
		return EXPCT;
	}

	public void setEXPCT(BigDecimal eXPCT) {
		EXPCT = eXPCT;
	}

	public String getLTEXT01() {
		return LTEXT01;
	}

	public void setLTEXT01(String lTEXT01) {
		LTEXT01 = lTEXT01;
	}

	public String getLTEXT02() {
		return LTEXT02;
	}

	public void setLTEXT02(String lTEXT02) {
		LTEXT02 = lTEXT02;
	}

	public BigDecimal getEXAMT() {
		return EXAMT;
	}

	public void setEXAMT(BigDecimal eXAMT) {
		EXAMT = eXAMT;
	}

	public Date getBEGDA() {
		return BEGDA;
	}

	public void setBEGDA(Date bEGDA) {
		BEGDA = bEGDA;
	}

	public BigDecimal getAMTEX() {
		return AMTEX;
	}

	public void setAMTEX(BigDecimal aMTEX) {
		AMTEX = aMTEX;
	}

	public String getLNMCH() {
		return LNMCH;
	}

	public void setLNMCH(String lNMCH) {
		LNMCH = lNMCH;
	}

	public String getTAXLV01() {
		return TAXLV01;
	}

	public void setTAXLV01(String tAXLV01) {
		TAXLV01 = tAXLV01;
	}

	public String getTAXLV02() {
		return TAXLV02;
	}

	public void setTAXLV02(String tAXLV02) {
		TAXLV02 = tAXLV02;
	}

	public String getCURR1() {
		return CURR1;
	}

	public void setCURR1(String cURR1) {
		CURR1 = cURR1;
	}

	public String getOBJECT_KEY() {
		return OBJECT_KEY;
	}

	public void setOBJECT_KEY(String oBJECT_KEY) {
		OBJECT_KEY = oBJECT_KEY;
	}

	public String getIRSLI() {
		return IRSLI;
	}

	public void setIRSLI(String iRSLI) {
		IRSLI = iRSLI;
	}

	public Date getAEDTM() {
		return AEDTM;
	}

	public void setAEDTM(Date aEDTM) {
		AEDTM = aEDTM;
	}

	public String getSPRTX() {
		return SPRTX;
	}

	public void setSPRTX(String sPRTX) {
		SPRTX = sPRTX;
	}

	public String getEICST() {
		return EICST;
	}

	public void setEICST(String eICST) {
		EICST = eICST;
	}

	public String getSPRPS() {
		return SPRPS;
	}

	public void setSPRPS(String sPRPS) {
		SPRPS = sPRPS;
	}

	public String getRWAMT() {
		return RWAMT;
	}

	public void setRWAMT(String rWAMT) {
		RWAMT = rWAMT;
	}

	public String getNRATX() {
		return NRATX;
	}

	public void setNRATX(String nRATX) {
		NRATX = nRATX;
	}

	public String getUNAME() {
		return UNAME;
	}

	public void setUNAME(String uNAME) {
		UNAME = uNAME;
	}

	public String getTAURT() {
		return TAURT;
	}

	public void setTAURT(String tAURT) {
		TAURT = tAURT;
	}

	public String getTXSTA() {
		return TXSTA;
	}

	public void setTXSTA(String tXSTA) {
		TXSTA = tXSTA;
	}

	public BigDecimal getDEPS_TOTAL_AMT() {
		return DEPS_TOTAL_AMT;
	}

	public void setDEPS_TOTAL_AMT(BigDecimal dEPS_TOTAL_AMT) {
		DEPS_TOTAL_AMT = dEPS_TOTAL_AMT;
	}

	public String getPEREX() {
		return PEREX;
	}

	public void setPEREX(String pEREX) {
		PEREX = pEREX;
	}

	public String getFRMND() {
		return FRMND;
	}

	public void setFRMND(String fRMND) {
		FRMND = fRMND;
	}

	public BigDecimal getOTHER_INC_AMT() {
		return OTHER_INC_AMT;
	}

	public void setOTHER_INC_AMT(BigDecimal oTHER_INC_AMT) {
		OTHER_INC_AMT = oTHER_INC_AMT;
	}

	public String getEICST01() {
		return EICST01;
	}

	public void setEICST01(String eICST01) {
		EICST01 = eICST01;
	}

	public BigDecimal getDEDUCT_AMT() {
		return DEDUCT_AMT;
	}

	public void setDEDUCT_AMT(BigDecimal dEDUCT_AMT) {
		DEDUCT_AMT = dEDUCT_AMT;
	}

	public String getNBREX() {
		return NBREX;
	}

	public void setNBREX(String nBREX) {
		NBREX = nBREX;
	}

	public String getDEPEX() {
		return DEPEX;
	}

	public void setDEPEX(String dEPEX) {
		DEPEX = dEPEX;
	}

	public String getNBQLC() {
		return NBQLC;
	}

	public void setNBQLC(String nBQLC) {
		NBQLC = nBQLC;
	}
}
