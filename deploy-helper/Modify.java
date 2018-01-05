import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
 * 替换文件（如果该文件含有子目录，则包括子目录所有文件）中某个字符串并写入新内容（Java代码实现）.
 *
 *原理：逐行读取源文件的内容，一边读取一边同时写一个*.tmp的文件。
 *当读取的行中发现有需要被替换和改写的目标内容‘行’时候，用新的内容‘行’替换之。
 *最终，删掉源文件，把*.tmp的文件重命名为源文件名字。
 *
 * */
public class Modify {

	private static String path ="";
	private static String outPath = "";
	private static File checkFile;
	public static  void operation() {
		File file = new File(path);
		opeationDirectory(file);
	}

	public static void opeationDirectory(File dir) {

		File[] files = dir.listFiles();
		for (int i = 0; i < files.length; i++) {
			File f = files[i];
			if (f.isDirectory())
				// 如果是目录，则递归。
				opeationDirectory(f);
			if (f.isFile())
				operationFile(f);
		}
	}

	//对每行的开头去除空格
	public static String checkStr(String str){
		 while(str.startsWith(" ")){
			 str = str.replaceFirst(" ", "");
		 }
		return str;
	}

	public static void operationFile(File file) {
		if(file.getName().endsWith(".js")||file.getName().endsWith(".ts")){
			String rgex = "'(.*?)'";
			try {
				InputStream is = new FileInputStream(file);
				BufferedReader reader = new BufferedReader(new InputStreamReader(is));
				String filename = file.getName();
				// tmpfile为缓存文件，代码运行完毕后此文件将重命名为源文件名字。
				File tmpfile = new File(file.getParentFile().getAbsolutePath() + "\\" + filename + ".tmp");
				BufferedWriter writer = new BufferedWriter(new FileWriter(tmpfile));
				FileWriter checkWriter = new FileWriter(checkFile,true);
				boolean flag = false;
				String str = null;
				int line = 1;
				while (true) {
					line ++;
					str = reader.readLine();
					if (str == null) {
						break;
					}
					String check = checkStr(str);
					if(!(check.startsWith("//")||check.startsWith("/*")||check.startsWith("*"))){
						List<String> list = getSubUtil(str, rgex);
						List<String > list1 = getSubUtil(str, "\"(.*?)\"");

						if (0 == list.size()&& 0 == list1.size()) {
							writer.write(str + "\n");
						} else {
							boolean tm = true;
							for (String a : list) {
								if (Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a)) {
									writer.write("// [国际化] " + str + "\n");
									writer.write(str.replace("'"+a+"'", " this.translateService.instant('" + a + "')") + "\n");
									System.out.println("替换内容:--->"+a);
									checkWriter.write("\""+a+"\": \"\"" +"+++line is "+line + "   file name is : "+filename+ "\n");
									flag = true;
								}else if(tm) {
									writer.write(str + "\n");
									flag = true;
									tm = false;
								}
							}
							for (String a : list1) {
								if (Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a)) {
									writer.write("// [国际化] " + str + "\n");
									writer.write(str.replace("\""+a+"\"", " this.translateService.instant('" + a + "')") + "\n");
									System.out.println("替换内容:--->"+a);
									checkWriter.write("\""+a+"\": \"\"" + "\n");
									flag = true;
								}else if(tm) {
									writer.write(str + "\n");
									flag = true;
									tm = false;
								}
							}
						}
					}else{
						writer.write(str + "\n");
					}
				}
				is.close();
				writer.flush();
				writer.close();
				checkWriter.close();
				if (flag) {
					file.delete();
					tmpfile.renameTo(new File(file.getAbsolutePath()));
				} else
					tmpfile.delete();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}

	/**
	 * 正则表达式匹配两个指定字符串中间的内容
	 *
	 * @param soap
	 * @return
	 */
	public static List<String> getSubUtil(String soap, String rgex) {
		List<String> list = new ArrayList<String>();
		Pattern pattern = Pattern.compile(rgex);// 匹配的模式
		Matcher m = pattern.matcher(soap);
		while (m.find()) {
			int i = 1;
			list.add(m.group(i));
			i++;
		}
		return list;
	}

	public static void main(String[] args) {
		// 代码测试：假设有一个test文件夹，test文件夹下含有若干文件或者若干子目录，子目录下可能也含有若干文件或者若干子目录（意味着可以递归操作）。
		path = args[0];
		outPath = args[1];
		checkFile = new File(outPath + "/checkJsFile.txt");
//		path = "/home/user/1208/WEB-Test";
		operation();
	}
}
