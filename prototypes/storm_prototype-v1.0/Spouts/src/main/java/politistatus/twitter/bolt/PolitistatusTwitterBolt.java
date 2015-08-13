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


  public PolitistatusTwitterBolt() throws UnknownHostException {
  }
	
  @Override
  public void execute(Tuple tuple, BasicOutputCollector collector) {
	  
	  Status status = (Status) tuple.getValueByField("tweet");
	  
	  System.out.println(status);
	  
	  BasicDBObject document = new BasicDBObject();
	  
	  document.put("id", status.getId());
	  document.put("location", status.getUser().getLocation());
	  document.put("date", status.getCreatedAt());

	  PolitistatusDatabase.getInstance().saveInDB(document);

  }

  @Override
  public void declareOutputFields(OutputFieldsDeclarer ofd) {
  }

}
