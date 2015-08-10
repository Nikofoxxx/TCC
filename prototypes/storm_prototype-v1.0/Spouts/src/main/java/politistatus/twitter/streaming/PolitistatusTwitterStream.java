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

package politistatus.twitter.streaming;

import java.io.NotSerializableException;
import java.net.UnknownHostException;
import java.util.Arrays;

import politistatus.mongodb.PolitistatusDatabase;
import politistatus.twitter.bolt.PolitistatusTwitterBolt;
import politistatus.twitter.streaming.PolitistatusTwitterSpout;
import backtype.storm.Config;
import backtype.storm.LocalCluster;
import backtype.storm.topology.TopologyBuilder;
import backtype.storm.utils.Utils;

public class PolitistatusTwitterStream {        
	
    public static void main(String[] args) throws UnknownHostException, NotSerializableException {
    	
        String consumerKey = args[0]; 
        String consumerSecret = args[1]; 
        String accessToken = args[2]; 
        String accessTokenSecret = args[3];
        String[] arguments = args.clone();
        String[] keyWords = Arrays.copyOfRange(arguments, 4, arguments.length);
        
        openDbConnection();
        
        TopologyBuilder builder = new TopologyBuilder();
        
        builder.setSpout("twitter", new PolitistatusTwitterSpout(consumerKey, consumerSecret,
                                accessToken, accessTokenSecret, keyWords));
        builder.setBolt("print", new PolitistatusTwitterBolt())
                .shuffleGrouping("twitter");
                        
        Config conf = new Config();
           
        LocalCluster cluster = new LocalCluster();
        
        cluster.submitTopology("Politistatus-topology", conf, builder.createTopology());
        
        Utils.sleep(10000);
//      cluster.shutdown();
    }
    
    private static void openDbConnection(){
    	 try {
			PolitistatusDatabase.getInstance().createDBConnection();
		} catch (UnknownHostException ex) {
			System.out.println("Erro ao conectar ao banco de dados: " + ex.getMessage());
		}
    }
}
