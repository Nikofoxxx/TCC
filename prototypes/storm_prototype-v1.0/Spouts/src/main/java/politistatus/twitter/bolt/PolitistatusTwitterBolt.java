/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package politistatus.twitter.bolt;

import java.net.UnknownHostException;

import politistatus.mongodb.PolitistatusDatabase;

import com.mongodb.BasicDBObject;

import backtype.storm.topology.BasicOutputCollector;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseBasicBolt;
import backtype.storm.tuple.Tuple;
import twitter4j.Status; 


public class PolitistatusTwitterBolt extends BaseBasicBolt {

private static final long serialVersionUID = 1L;

private PolitistatusDatabase database;
  
  public PolitistatusTwitterBolt() throws UnknownHostException {
}
	
  @Override
  public void execute(Tuple tuple, BasicOutputCollector collector) {
	  
	  Status status = (Status) tuple.getValueByField("tweet");
	  System.out.println(status);
	  
	  try {
		BasicDBObject document = new BasicDBObject();
		database = new PolitistatusDatabase();
		
		  document.put("name", status.getUser().getName());
		  document.put("screen_name", status.getUser().getScreenName());
		  document.put("profile_image", status.getUser().getProfileImageURL());
		  document.put("location", status.getUser().getLocation());
		  document.put("date", status.getCreatedAt());
		  document.put("comment", status.getText());
		  document.put("followers_count", status.getUser().getFollowersCount());
		  document.put("url", status.getUser().getURL());
		  database.saveInDB(document);
	} catch (UnknownHostException ex) {
		System.out.println("Erro :" + ex.getMessage());
	}
  }

  @Override
  public void declareOutputFields(OutputFieldsDeclarer ofd) {
  }

}
