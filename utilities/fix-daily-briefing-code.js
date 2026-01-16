/**
 * Fixed Code for Daily Briefing Workflow
 * More robust extraction of task names and context from Notion
 * 
 * This fixes the issue where tasks show as "Untitled" and context as "No Context"
 */

const fixedCode = `// Group tasks by @Context - FIXED VERSION
const tasks = $input.all();
const grouped = {};

tasks.forEach(item => {
  const json = item.json;
  const props = json.properties || {};
  
  // Debug: Log first item structure to understand format
  if (tasks.indexOf(item) === 0) {
    console.log('Sample item structure:', JSON.stringify(json, null, 2));
    console.log('Properties keys:', Object.keys(props));
  }
  
  // Extract @Context value - try multiple variations
  let context = 'No Context';
  
  // Try different property name variations
  const contextProps = [
    props['@Context'],
    props['@context'],
    props['Context'],
    props['context'],
    props['Context Tag'],
    props['ContextTag']
  ];
  
  for (const contextProp of contextProps) {
    if (contextProp) {
      if (contextProp.select && contextProp.select.name) {
        context = contextProp.select.name;
        break;
      } else if (typeof contextProp === 'string') {
        context = contextProp;
        break;
      }
    }
  }
  
  // Extract task name - try multiple property name variations and formats
  let taskName = 'Untitled';
  
  // Try different property name variations
  const nameProps = [
    props['Name'],
    props['name'],
    props['Task'],
    props['task'],
    props['Title'],
    props['title'],
    props['Task Name'],
    props['TaskName']
  ];
  
  for (const nameProp of nameProps) {
    if (nameProp) {
      // Handle title property (array of rich text objects)
      if (nameProp.title && Array.isArray(nameProp.title) && nameProp.title.length > 0) {
        // Extract plain_text from first title element
        taskName = nameProp.title[0].plain_text || nameProp.title[0].text || 'Untitled';
        if (taskName !== 'Untitled') break;
      }
      // Handle simplified format (direct string)
      else if (typeof nameProp === 'string' && nameProp.trim() !== '') {
        taskName = nameProp.trim();
        break;
      }
      // Handle rich_text format
      else if (nameProp.rich_text && Array.isArray(nameProp.rich_text) && nameProp.rich_text.length > 0) {
        taskName = nameProp.rich_text[0].plain_text || nameProp.rich_text[0].text || 'Untitled';
        if (taskName !== 'Untitled') break;
      }
    }
  }
  
  // Extract When value
  let when = '';
  const whenProps = [
    props['When'],
    props['when'],
    props['Due Date'],
    props['DueDate']
  ];
  
  for (const whenProp of whenProps) {
    if (whenProp) {
      if (whenProp.select && whenProp.select.name) {
        when = whenProp.select.name;
        break;
      } else if (whenProp.date) {
        // Handle date property if needed
        when = whenProp.date.start || '';
        break;
      }
    }
  }
  
  if (!grouped[context]) {
    grouped[context] = [];
  }
  
  grouped[context].push({
    name: taskName,
    when: when,
    id: json.id
  });
});

// Build summary
const totalTasks = tasks.length;
const today = new Date().toLocaleDateString('en-MY', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

let htmlBody = \`<h2>🌅 Good Morning, Jay!</h2>
<p><strong>Date:</strong> \${today}</p>
<p><strong>Total Tasks:</strong> \${totalTasks}</p>
<hr>\`;

let plainText = \`Good Morning, Jay!\\nDate: \${today}\\nTotal Tasks: \${totalTasks}\\n\\n\`;

// Sort contexts alphabetically
const sortedContexts = Object.keys(grouped).sort();

sortedContexts.forEach(context => {
  const contextTasks = grouped[context];
  const overdueCount = contextTasks.filter(t => t.when === 'Past').length;
  const todayCount = contextTasks.filter(t => t.when === 'Today').length;
  
  htmlBody += \`<h3>\${context} (\${contextTasks.length})</h3>\`;
  if (overdueCount > 0) {
    htmlBody += \`<p style="color: red;">⚠️ \${overdueCount} overdue</p>\`;
  }
  htmlBody += '<ul>';
  
  plainText += \`\\n\${context} (\${contextTasks.length})\\n\`;
  if (overdueCount > 0) {
    plainText += \`  ⚠️ \${overdueCount} overdue\\n\`;
  }
  
  contextTasks.forEach(task => {
    const overdueTag = task.when === 'Past' ? ' 🔴' : '';
    htmlBody += \`<li>\${task.name}\${overdueTag}</li>\`;
    plainText += \`  • \${task.name}\${overdueTag}\\n\`;
  });
  
  htmlBody += '</ul>';
});

htmlBody += \`<hr><p style="color: gray; font-size: 12px;">Sent by n8n Daily Briefing Workflow</p>\`;

return [{
  json: {
    subject: \`📋 Daily Briefing: \${totalTasks} tasks for \${today}\`,
    htmlBody: htmlBody,
    plainText: plainText,
    totalTasks: totalTasks,
    contexts: sortedContexts,
    grouped: grouped
  }
}];`;

console.log('Fixed Code for Daily Briefing Workflow:');
console.log('==========================================');
console.log(fixedCode);
console.log('\n==========================================');
console.log('\nTo use this:');
console.log('1. Open workflow "1.3 Daily Briefing - Tasks to Gmail" in n8n');
console.log('2. Click on the "Group by Context" Code node');
console.log('3. Replace the existing code with the code above');
console.log('4. Save and test the workflow');

module.exports = { fixedCode };
