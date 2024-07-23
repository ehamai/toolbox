# ARM Tools

## Authenticating
Before you can run any scripts which call ARM, you need to first login and set your token for your environment.  Run the following from the "arm" folder on your local terminal:

1. az login
2. source ./setToken.sh

## Deleting Resource Groups
To see the list of RGs that will be deleted, run this:

<pre>node deleteRgs.js -subscriptionId {subId} </pre>

If you would like to exclude any resourceIds from being deleted, add a file named <b>'.donotdelete'</b> within the arm folder.  Just add each resourceId on a new line like so:
<pre>
{resourceId1}
{resourceId2}
{resourceId3}
</pre>

Once defined here, rerun the command above and it will tell you which resource groups will be excluded from the uber list.

And finally, once you're ready to actually delete your resourceGroups, run this:
<pre>node deleteRgs.js -subscriptionId {subId} --write</pre>

Note: As a safety guard, the script will prompt you to confirm if you would like to move forward before actually deleting your RGs.