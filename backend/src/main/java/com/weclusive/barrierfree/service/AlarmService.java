package com.weclusive.barrierfree.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.weclusive.barrierfree.entity.Alarm;

public interface AlarmService {

	public List<Map<String, Object>> readAlarm(int userSeq);

	public Alarm save(Alarm alarm);

	public Optional<Alarm> updateByAlarmSeq(long alarmSeq, int type, int userSeq);

	public int deleteOldAlarm();

	public int saveAlaram(int userSeq, char type, long data);



}
