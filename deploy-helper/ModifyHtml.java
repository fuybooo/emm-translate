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

import org.omg.CosNaming.NamingContextExtPackage.StringNameHelper;

/*
 * 替换文件（如果该文件含有子目录，则包括子目录所有文件）中某个字符串并写入新内容（Java代码实现）.
 *
 *原理：逐行读取源文件的内容，一边读取一边同时写一个*.tmp的文件。
 *当读取的行中发现有需要被替换和改写的目标内容‘行’时候，用新的内容‘行’替换之。
 *
 * */
public class ModifyHtml {

	private static String path = "";
	private static String outPath = "";
	private static File checkFile;


	public static void operation() {
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

	// 对每行的开头去除空格
	public static String checkStr(String str) {
		while (str.startsWith(" ")) {
			str = str.replaceFirst(" ", "");
		}
		return str;
	}

	public static void operationFile(File file) {
		if (file.getName().endsWith(".html")) {
			try {
				InputStream is = new FileInputStream(file);
				BufferedReader reader = new BufferedReader(new InputStreamReader(is));
				String filename = file.getName();
				// tmpfile为缓存文件，代码运行完毕后此文件将重命名为源文件名字。
				File tmpfile = new File(file.getParentFile().getAbsolutePath() + "\\" + filename + ".tmp");
				BufferedWriter writer = new BufferedWriter(	new FileWriter(tmpfile));
				FileWriter checkWriter = new FileWriter(checkFile,true);
				boolean flag = false;
				String str = null;
//				int line = 1;
				while (true) {
//					line ++;
					str = reader.readLine();
					if (str == null) {
						break;
					}
					String check = checkStr(str);
					List<String> list = getSubUtil(str, ">(.*?)<");// 截取>*<之间的字符串
					List<String> list1 = getSubUtil(str, "\"(.*?)\"");// 截取"*"之间的字符串
					List<String> list3 = getSubUtil(str, "'(.*?)'");// 截取'*'之间的字符串
					boolean g = Pattern.matches( "^.*[\u0391-\uFFE5]+.*$",str);
					if(!g){
						writer.write(str + "\n");
						flag = true;
					}else if (!(check.startsWith("<!"))) {
						boolean tm = Pattern.matches("^[\u0391-\uFFE5]+.*$", check);
						boolean flag1 = true;
						if (Pattern.matches("^[\u0391-\uFFE5]+.*$", check)) {// 以中文开头
							// <!-- [国际化] <td>设备分组</td>-->
							writer.write("<!-- [国际化] " + str + "-->" + "\n");
							// {{'设备分组' | translate}}
							writer.write(str.replace(check, "{{'" + check + "' | translate}}") + "\n");
							flag = true;
							System.out.println("替换内容:--->" + check);
							checkWriter.write("\""+check+"\": \"\"" + "\n");
//							checkWriter.write("\""+check+"\": \"\"" +"+++line is "+line + "   file name is : "+filename+ "\n");
						}
						boolean r1 = true;
						if (!(list.size()==0)) {// 对>中文<进行处理
							int i=0;
								for (String a : list) {
									i++;
									if (Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a)) {
										writer.write("<!-- [国际化] " + str + "-->" + "\n");
										writer.write(str.replace(a, "{{'" + a + "' | translate}}") + "\n");
										System.out.println("替换内容:--->" + a);
										checkWriter.write("\""+a+"\": \"\"" + "\n");
//										checkWriter.write("\""+a+"\": \"\"" +"+++line is "+line + "   file name is : "+filename+ "\n");
										flag = true;
										flag1 = false;
										r1 = false;
									}else if(!Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a) && r1) {
										if(null != a && !"".equals(a)){
											writer.write(str + "\n");
											flag = true;
											r1= false;
											flag1 = false;
										}
									}
									if(r1&&i==list.size()){
										writer.write(str + "\n");
										r1 = false;
										flag = true;
										flag1 = false;
									}
							}
						}
						boolean repeat = true;
						if (0 != list1.size()) {
							for (String a : list1) {
								if (Pattern.matches("^'.*[\u0391-\uFFE5]+.*'$", a)) {
									List<String> list2 = getSubUtil(a, "'(.*?)'");
									for (String iString : list2) {
										if (Pattern.matches("^.*[\u0391-\uFFE5]+.*$", iString)) {
											String aString = iString.replace("'", "");
											writer.write("<!-- [国际化] " + str + "-->" + "\n");
											writer.write(str.replace(a, a + " | translate") + "\n");
											System.out.println("替换内容:--->" + a);
											checkWriter.write("\""+a+"\": \"\"" + "\n");
//											checkWriter.write("\""+aString+"\": \"\"" +"+++line is "+line + "   file name is : "+filename+ "\n");
											flag = true;
											flag1 = false;
										}
									}
								} else if (Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a)) {
									writer.write("<!-- [国际化] " + str + "-->" + "\n");
									writer.write(str.replace(a, "{{'" + a + "' | translate}}") + "\n");
									System.out.println("替换内容:--->" + a);
									checkWriter.write("\""+a+"\": \"\"" + "\n");
//									checkWriter.write("\""+a+"\": \"\"" +"+++line is "+line + "   file name is : "+filename+ "\n");
									flag = true;
									flag1 = false;
								}
								if(flag1&&!Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a)&&repeat){
									writer.write(str + "\n");
									repeat = false;
									flag = true;
									flag1 = false;
								}
							}
						}
						boolean r2 = true;
						if(flag1&&0 != list3.size()){
							for(String a : list3){
								if(Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a)){
									writer.write("<!-- [国际化] " + str + "-->" + "\n");
									writer.write(str.replace("'"+a+"'", "'"+a +"'"+ " | translate") + "\n");
									flag1 = false;
									System.out.println("替换内容-->"+a);
									checkWriter.write("\""+a+"\": \"\"" + "\n");
//									checkWriter.write("\""+a+"\": \"\"" +"+++line is "+line + "   file name is : "+filename+ "\n");
								} else if(!Pattern.matches("^.*[\u0391-\uFFE5]+.*$", a)&&r2) {
									writer.write(str + "\n");
									flag = true;
									flag1 = false;
									r2 = false;
								}
							}
						}
						if (flag1&&list.size() == 0 && list1.size() == 0 && !tm&&0 == list3.size()) {
							writer.write(str + "\n");
							flag = true;
							flag1 = false;
						}
					} else {
						writer.write(str + "\n");
						flag = true;
					}

				}
				is.close();
				writer.flush();
				writer.close();
//				checkWriter.flush();
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
		checkFile = new File(outPath + "/checkHtmlFile.txt");
		// path = "/home/user/1208/WEB-Test";
		operation();
	}
}
