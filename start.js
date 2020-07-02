const fs = require('fs');
var express = require('express'); 
const { Console } = require('console');
main = function () {
    fs.readFile('./config/core.json', (err, data) => {
        if (err) throw err;
        let student = JSON.parse(data);
        //console.log(student);
        //console.log(generate(30));
        //console.log("// ///////////////////// //");
        console.log("/////////////////////////////");
        console.log("// \x1b[36m%s\x1b[0m", "OrmePanel Daemon System"," //");
        console.log("///////////////////////////");
        console.log("");
        console.log("Chargement en cours...");
        console.log("Vérification des modules de bases...");
        console.log("module.sftp: " + student.server_info.sftp.module_enable);
        if(student.server_info.sftp.module_enable == "ON")
        {
            console.log("ERREUR: Le " + "SFTP" + "module n'est pas fonctionnel.");
            console.log("ERREUR->SUITE: Merci de mettre student.server_info.sftp.module_enable sur OFF");
        }
        console.log("Préparation des variables JSON-SERVER...");
        var hostname = student.server_info.adress_ip; 
        var port = student.server_info.port; 
        console.log("Lancement de JSON-SERVER");
        var app = express(); 
        var myRouter = express.Router(); 
        myRouter.route('/daemon')
        .get(function(req,res){ 
            console.log("DAEMON-SERVER: req.query.cmd:  " + req.query.cmd + " & req.query.arg1:  " + req.query.arg1);
            if(req.query.apikey != student.apikey)
            {
                res.json({message : `apikey non valable`, methode : req.method});
            }else{
                    if ( req.query.cmd == "console.server" ) {
                            const { exec } = require('child_process');
                                exec('docker logs docker-tutorial', (err, stdout, stderr) => {
                                if (err) {
                                    //some err occurred
                                    console.error(err)
                                }
                                // the *entire* stdout and stderr (buffered)
                                //console.log(`stdout: ${stdout}`);
                                //console.log(`stderr: ${stderr}`);
                                    res.send(`${stdout}`);
                            });
                        
                    }
                    if(req.query.cmd == "start.server")
                    {
                            const { exec } = require('child_process');
                            exec('cd',[__dirname + "\\daemon-data\\" + req.query.arg1]);
                            exec('docker run -e EULA=TRUE -d -p 25565:25565 --name '+ req.query.arg1 +' itzg/minecraft-server', (err, stdout, stderr) => {
                                if (err) {
                                    //some err occurred
                                    console.error(err)
                                } else {
                                // the *entire* stdout and stderr (buffered)
                                console.log(`stdout: ${stdout}`);
                                console.log(`stderr: ${stderr}`);
                                res.send(`${stdout}`);
                                }
                            });
                    }if(req.query.cmd == "install.server")
                    {
                        if(req.query.cmd_arg1 != null)
                        {
                            const { exec } = require('child_process');
                            exec('mkdir',['./daemon-data/' + req.query.cmd_arg1]);
                            exec('cd',['./daemon-data/' + req.query.cmd_arg1]);
                            exec('docker pull itzg/minecraft-server');
                        }
                    }if(req.query.cmd == "stop.server"){
                        if(req.query.cmd_arg1 != null)
                        {
                            const { exec } = require('child_process');
                            exec('docker stop '+ req.query.cmd_arg1, (err, stdout, stderr) => {
                            if (err) {
                                //some err occurred
                                console.error(err)
                            } else {
                            // the *entire* stdout and stderr (buffered)
                            console.log(`stdout: ${stdout}`);
                            console.log(`stderr: ${stderr}`);
                            }
                            });
                    }if(req.query.cmd == "getinfo.server"){
                            if(req.query.cmd_arg1 != null)
                            {
                                const { exec } = require('child_process');
                                exec('docker stats --no-stream --format "{{.CPUPerc}}" hello-world', (err, stdout, stderr) => {
                                if (err) {
                                    //some err occurred
                                    console.error(err)
                                } else {
                                // the *entire* stdout and stderr (buffered)
                                console.log(`stdout: ${stdout}`);
                                console.log(`stderr: ${stderr}`);
                                    exec('docker stats --no-stream --format "{{.MemUsage}}" hello-world', (err2, stdout2, stderr2) => {
                                        if (err2) {
                                            //some err occurred
                                            console.error(err2)
                                        } else {
                                        // the *entire* stdout and stderr (buffered)
                                        console.log(`stdout: ${stdout2}`);
                                        console.log(`stderr: ${stderr2}`);
                                            exec('docker stats --no-stream --format "{{.CPUPerc}}" hello-world', (err22, stdout22, stderr22) => {
                                            if (err22) {
                                                //some err occurred
                                                console.error(err22)
                                            } else {
                                            // the *entire* stdout and stderr (buffered)
                                            console.log(`stdout: ${stdout22}`);
                                            console.log(`stderr: ${stderr22}`);
                                            }
                                        });
                                }
                            });
                        }
                                });
                            }
                    
                }
                  
            }
            
        }})
        app.use(myRouter);  
        console.log("Chargement terminé !");
        console.log("");
        app.listen(port, hostname, function(){
            console.log("JSON-SERVER: Serveur lancer à http://"+ hostname +":"+port); 
        });
    });
};
main();

function generate(l) {
    if (typeof l==='undefined'){var l=8;}
    /* c : chaîne de caractères alphanumérique */
    var c='abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ12345679',
    n=c.length,
    /* p : chaîne de caractères spéciaux */
    p='',
    o=p.length,
    r='',
    n=c.length,
    /* s : determine la position du caractère spécial dans le mdp */
    s=Math.floor(Math.random() * (p.length-1));

    for(var i=0; i<l; ++i){
        if(s == i){
            /* on insère à la position donnée un caractère spécial aléatoire */
            r += p.charAt(Math.floor(Math.random() * o));
        }else{
            /* on insère un caractère alphanumérique aléatoire */
            r += c.charAt(Math.floor(Math.random() * n));
        }
    }
    return r;
}