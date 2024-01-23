/**
 * 重构自动目录的重复标签
 *  ui.vp-catalogs deep 总目录体
 * ---> li.vp-catalog 第一级目录（this不是目录时该标签是文章链接地址）
 * ------> ui.vp-child-catalogs 存在第二级目录时有
 * ----------> li.vp-child-catalog 这里出现重复，把重复的li标签添加classList.add样式 sc
 * --------------> div.vp-catalog-sub-title(和vp-sub-catalogs-wrapper)
 * -----------------> a.vp-link
 * 
 */

// 获取所有的二级目录
const child_catalogs = document.getElementsByClassName("vp-child-catalogs");
// console.log("所有的二级目录",child_catalogs);

for (let indexs = 0; indexs < child_catalogs.length; indexs++) {
    // 第indexs个二级目录
    const child_catalog = child_catalogs[indexs];
    const this_child_catalog = child_catalog.getElementsByClassName("vp-child-catalog");
    const this_child_catalog_length = this_child_catalog.length;

    const this_sub_catalogs_wrapper = child_catalog.getElementsByClassName("vp-sub-catalogs-wrapper");

    if (this_sub_catalogs_wrapper.length > 0) {
        // console.log("第",indexs,"目录的",this_sub_catalogs_wrapper);
        const li_names_sub = this_sub_catalogs_wrapper[0].querySelectorAll(".vp-link");
        for (let a = 0; a < li_names_sub.length; a++) {
            const li_names = li_names_sub[a];
            for (let b = a + 1; b < li_names_sub.length; b++) {
                const li_names_2 = li_names_sub[b];
                if (li_names_2.href == li_names.href) {
                    li_names_sub[b].classList.add("sc");
                }
            }
        }
    }

    //把每个li标签的href地址对比，相同则视为重复，只保留一个li标签，判断当前的目录下存在的重复li标签
    for (let a = 0; a < this_child_catalog_length; a++) {
        //获取当前li标签下的vp-link
        const li_names = this_child_catalog[a].querySelector(".vp-link");

        //把第二次出现的地址 href
        for (let b = a + 1; b < this_child_catalog_length; b++) {
            const li_names_2 = this_child_catalog[b].querySelector(".vp-link");
            if (li_names_2.href == li_names.href) {
                //把b-1索引的添加 标签添加classList.add样式
                // console.log("第",a,"对比",b,"---------相同");
                this_child_catalog[b].classList.add("sc");
            }
            // else{
            //     console.log("第",a,"对比",b,"====不相同");
            // }
        }
        // console.log("第",indexs,"-",a,"的",li_names.href);
    }
    // console.log("第",indexs,"目录处理",this_child_catalog);
}
