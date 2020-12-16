package valv.hr.connectivity.rfc.structures;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class PO_PERSONAL_DATA {

	@JsonProperty
	String ANREX;
	
	@JsonProperty
	String ITBLD;
	
	@JsonProperty
	String PERNR;
	
	@JsonProperty
	Date ENDDA;
	
	@JsonProperty
	String RUFNM;
	
	@JsonProperty
	String NA2TX;
	
	@JsonProperty
	String FATXT;
	
	@JsonProperty
	String VORNA;
	
	@JsonProperty
	String NA3TX;
	
	@JsonProperty
	String NATIO;
	
	@JsonProperty
	String KNZNM;
	
	@JsonProperty
	String GESCH;
	
	@JsonProperty
	String SPRSL;
	
	@JsonProperty
	String ANRED;
	
	@JsonProperty
	String NAMZU;
	
	@JsonProperty
	BigDecimal ANZKD;
	
	@JsonProperty
	String NACHN;
	
	@JsonProperty
	String PERID;
	
	@JsonProperty
	String ENAME;
	
	@JsonProperty
	String NATI3;
	
	@JsonProperty
	Date BEGDA;
	
	@JsonProperty
	String NATI2;
	
	@JsonProperty
	String SPTXT;
	
	@JsonProperty
	String TITL2;
	
	@JsonProperty
	String INITS;
	
	@JsonProperty
	String FAMST;
	
	@JsonProperty
	String OBJECT_KEY;
	
	@JsonProperty
	String NATTX;

	@JsonProperty
	Date AEDTM;
	
	@JsonProperty
	String SPRTX;
	
	@JsonProperty
	String NAME2;
	
	@JsonProperty
	String SPRPS;
	
	@JsonProperty
	String GESTX;
	
	@JsonProperty
	String UNAME;
	
	@JsonProperty
	String NACH2;
	
	@JsonProperty
	String MIDNM;
	
	@JsonProperty
	Date GBDAT;
	
	@JsonProperty
	Date FAMDT;

	public String getANREX() {
		return ANREX;
	}

	public void setANREX(String aNREX) {
		ANREX = aNREX;
	}

	public String getITBLD() {
		return ITBLD;
	}

	public void setITBLD(String iTBLD) {
		ITBLD = iTBLD;
	}

	public String getPERNR() {
		return PERNR;
	}

	public void setPERNR(String pERNR) {
		PERNR = pERNR;
	}

	public Date getENDDA() {
		return ENDDA;
	}

	public void setENDDA(Date eNDDA) {
		ENDDA = eNDDA;
	}

	public String getRUFNM() {
		return RUFNM;
	}

	public void setRUFNM(String rUFNM) {
		RUFNM = rUFNM;
	}

	public String getNA2TX() {
		return NA2TX;
	}

	public void setNA2TX(String nA2TX) {
		NA2TX = nA2TX;
	}

	public String getFATXT() {
		return FATXT;
	}

	public void setFATXT(String fATXT) {
		FATXT = fATXT;
	}

	public String getVORNA() {
		return VORNA;
	}

	public void setVORNA(String vORNA) {
		VORNA = vORNA;
	}

	public String getNA3TX() {
		return NA3TX;
	}

	public void setNA3TX(String nA3TX) {
		NA3TX = nA3TX;
	}

	public String getNATIO() {
		return NATIO;
	}

	public void setNATIO(String nATIO) {
		NATIO = nATIO;
	}

	public String getKNZNM() {
		return KNZNM;
	}

	public void setKNZNM(String kNZNM) {
		KNZNM = kNZNM;
	}

	public String getGESCH() {
		return GESCH;
	}

	public void setGESCH(String gESCH) {
		GESCH = gESCH;
	}

	public String getSPRSL() {
		return SPRSL;
	}

	public void setSPRSL(String sPRSL) {
		SPRSL = sPRSL;
	}

	public String getANRED() {
		return ANRED;
	}

	public void setANRED(String aNRED) {
		ANRED = aNRED;
	}

	public String getNAMZU() {
		return NAMZU;
	}

	public void setNAMZU(String nAMZU) {
		NAMZU = nAMZU;
	}

	public BigDecimal getANZKD() {
		return ANZKD;
	}

	public void setANZKD(BigDecimal aNZKD) {
		ANZKD = aNZKD;
	}

	public String getNACHN() {
		return NACHN;
	}

	public void setNACHN(String nACHN) {
		NACHN = nACHN;
	}

	public String getPERID() {
		return PERID;
	}

	public void setPERID(String pERID) {
		PERID = pERID;
	}

	public String getENAME() {
		return ENAME;
	}

	public void setENAME(String eNAME) {
		ENAME = eNAME;
	}

	public String getNATI3() {
		return NATI3;
	}

	public void setNATI3(String nATI3) {
		NATI3 = nATI3;
	}

	public Date getBEGDA() {
		return BEGDA;
	}

	public void setBEGDA(Date bEGDA) {
		BEGDA = bEGDA;
	}

	public String getNATI2() {
		return NATI2;
	}

	public void setNATI2(String nATI2) {
		NATI2 = nATI2;
	}

	public String getSPTXT() {
		return SPTXT;
	}

	public void setSPTXT(String sPTXT) {
		SPTXT = sPTXT;
	}

	public String getTITL2() {
		return TITL2;
	}

	public void setTITL2(String tITL2) {
		TITL2 = tITL2;
	}

	public String getINITS() {
		return INITS;
	}

	public void setINITS(String iNITS) {
		INITS = iNITS;
	}

	public String getFAMST() {
		return FAMST;
	}

	public void setFAMST(String fAMST) {
		FAMST = fAMST;
	}

	public String getOBJECT_KEY() {
		return OBJECT_KEY;
	}

	public void setOBJECT_KEY(String oBJECT_KEY) {
		OBJECT_KEY = oBJECT_KEY;
	}

	public String getNATTX() {
		return NATTX;
	}

	public void setNATTX(String nATTX) {
		NATTX = nATTX;
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

	public String getNAME2() {
		return NAME2;
	}

	public void setNAME2(String nAME2) {
		NAME2 = nAME2;
	}

	public String getSPRPS() {
		return SPRPS;
	}

	public void setSPRPS(String sPRPS) {
		SPRPS = sPRPS;
	}

	public String getGESTX() {
		return GESTX;
	}

	public void setGESTX(String gESTX) {
		GESTX = gESTX;
	}

	public String getUNAME() {
		return UNAME;
	}

	public void setUNAME(String uNAME) {
		UNAME = uNAME;
	}

	public String getNACH2() {
		return NACH2;
	}

	public void setNACH2(String nACH2) {
		NACH2 = nACH2;
	}

	public String getMIDNM() {
		return MIDNM;
	}

	public void setMIDNM(String mIDNM) {
		MIDNM = mIDNM;
	}

	public Date getGBDAT() {
		return GBDAT;
	}

	public void setGBDAT(Date gBDAT) {
		GBDAT = gBDAT;
	}

	public Date getFAMDT() {
		return FAMDT;
	}

	public void setFAMDT(Date fAMDT) {
		FAMDT = fAMDT;
	}

	
}
