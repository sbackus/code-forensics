var fs      = require('fs'),
    _       = require('lodash'),
    utils = require('../utils'),
    Git     = require('../vcs_support').Git,
    pp      = require('../parallel_processing');

module.exports = function(context, taskDef) {
  var gitRepo = new Git(context.repository.root);
  taskDef.add('git-log-dump', 'Retrieve stats from git log entries\nUsage: gulp git-log-dump [--dateFrom <date> --dateTo <date>]', function(cb) {
    return pp.taskExecutor(context.jobRunner).processAll(utils.functions.arrayToFnFactory(context.timePeriods, function(period) {
      if (!utils.fileSystem.isFile(context.files.temp.gitlog(period))) {
        return gitRepo.logStream(period)
        .pipe(fs.createWriteStream(context.files.temp.gitlog(period)));
      }
    }));
  });

  taskDef.add('git-log-messages', 'Retrieve commit messages from git log entries\nUsage: gulp git-log-messages [--dateFrom <date> --dateTo <date>]', function() {
    return pp.taskExecutor(context.jobRunner).processAll(utils.functions.arrayToFnFactory(context.timePeriods, function(period) {
      if (!utils.fileSystem.isFile(context.files.temp.gitlogMessages(period))) {
        return gitRepo.commitMessagesStream(period)
        .pipe(fs.createWriteStream(context.files.temp.gitlogMessages(period)));
      }
    }));
  });
};