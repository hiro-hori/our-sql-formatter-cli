import fs from 'fs';
import sqlFormatter from 'sql-formatter-plus';
import process from "process";

const file_name = process.argv[2];

if (!file_name || !fs.existsSync(file_name)) {
    console.log("エラー：ファイル名なし");
    process.exit(1);
}

const content = fs.readFileSync(
    file_name,
    'utf8',
);

// const modifyComment = (content, args) => content
//     .replace(args.replacee_start_target, args.replacer_start_str)
//     .replace(args.replacee_end_target, args.replacer_end_str)
// const modifyComment = (content, args) => args.map(x => content.replace(x.before_pattern, x.after_str));
const modifyComment = (content, args) => {
    for (const arg of args) {
        // console.log(arg.before_pattern);
        // console.log(arg.after_str);
        content = content.replace(arg.before_pattern, arg.after_str);
    }
    return content;
}

const comment_str = "f2e4becdf6b74875b4fbabbc27bad0fe";
const comment_str2 = "6a6c13c53ef0406bb09c7b550b008a0a";

const replace_arguments = [
    // { before_pattern: new RegExp(`(?<!\/\*${comment_str}){{`, "g"), after_str: `/*${comment_str}{{` },
    // { before_pattern: new RegExp(`}}(?!${comment_str}\*\/)`, "g"), after_str: `}}${comment_str}*/` },
    { before_pattern: /{{/g, after_str: `/*${comment_str}{{` },
    { before_pattern: /}}/g, after_str: `}}${comment_str}*/` },
    // { before_pattern: /\${(.*?)}/g, after_str: "/*COMMENT${$1}COMMENT*/" }, // non-greedy
    // { before_pattern: /\${(.*)}/g, after_str: "comment$1comment" }, // greedy
    { before_pattern: /\${(.*?)}/g, after_str: `${comment_str2}$1${comment_str2}` }, // non-greedy
    // replacee_start_target: /(?<!\/\*COMMENT){{/g,
    // replacer_start_str: "/*COMMENT{{",
    // replacee_end_target: /}}(?!COMMENT\*\/)/g,
    // replacer_end_str: "}}COMMENT*/",
];

const contents_commented_out_template_engine_syntax = modifyComment(content, replace_arguments);

// console.log(contents_commented_out_template_engine_syntax);

// import repl from "repl";
// repl.start({useGlobal:true});

fs.writeFileSync(file_name, contents_commented_out_template_engine_syntax);

const formatted_content = sqlFormatter.format(contents_commented_out_template_engine_syntax, {
  // language: 'n1ql', // Defaults to "sql"
  // indent: '    ', // Defaults to two spaces,
  uppercase: true, // Defaults to false
  // linesBetweenQueries: 2 // Defaults to 1
});

fs.writeFileSync(file_name, formatted_content);

const replace_arguments2 = [
    { before_pattern: new RegExp(`/\\*${comment_str}{{`, "g"), after_str: "{{" },
    { before_pattern: new RegExp(`}}${comment_str}\\*/`, "g"), after_str: "}}" },
    { before_pattern: new RegExp(`${comment_str2}(.*?)${comment_str2}`, "g"), after_str: "${$1}" },
];
const final_contents = modifyComment(formatted_content, replace_arguments2);

fs.writeFileSync(file_name, final_contents);
