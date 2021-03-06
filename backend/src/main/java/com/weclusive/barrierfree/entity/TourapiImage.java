package com.weclusive.barrierfree.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class TourapiImage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tim_seq")
	private long timSeq;

	@Column(name = "content_id")
	private long contentId;

	@Column(name = "tim_image")
	private String timImage;

	@Column(name="del_yn")
	private char delYn = 'n';
	
	@Column(name="reg_dt")
	private String regDt;
	
	@Column(name="reg_id")
	private String regId;
	
	@Column(name="mod_dt")
	private String modDt;
	
	@Column(name="mod_id")
	private String modId;

	@Builder
	public TourapiImage(long contentId, String timImage, char delYn, String regDt, String regId, String modDt,
			String modId) {
		super();
		this.contentId = contentId;
		this.timImage = timImage;
		this.delYn = delYn;
		this.regDt = regDt;
		this.regId = regId;
		this.modDt = modDt;
		this.modId = modId;
	}
	
}
